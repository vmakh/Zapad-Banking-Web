const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const ts=require('typescript');
const vm=require('node:vm');
function environment(data=new Map()) {
 const cache=new Map();let fail=false;
 const storage={getItem:k=>data.get(k)??null,setItem:(k,v)=>{if(fail)throw Error('quota');data.set(k,v);}};
 function load(file){
  if(cache.has(file))return cache.get(file).exports;
  const mod={exports:{}};cache.set(file,mod);
  const code=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
  vm.runInNewContext(`(function(require,module,exports){${code}\n})`,{localStorage:storage,crypto:{randomUUID:()=> 'test-goal'}})(name=>{
   // These exports are presentation-only; the tests exercise the real data modules.
   if(name==='react')return {useSyncExternalStore:()=>{throw Error('UI hook is not under test');}};
   if(name.startsWith('@phosphor-icons/react/')) {
    const glyph = path.basename(name) + 'Icon';
    return {[glyph]: glyph};
   }
   return load(path.resolve(path.dirname(file),name+'.ts'));
  },mod,mod.exports);return mod.exports;
 }
 const root=path.resolve('src/app/data');
 return {data,cards:load(path.join(root,'cards.ts')),goals:load(path.join(root,'goals.ts')),fail:()=>{fail=true;}};
}
test('card settings survive reload and remain profile-specific',()=>{
 const e=environment();e.cards.updateCard('personal','p1',{frozen:true,onlineEnabled:false,limits:{online:0,contactless:12.34,atm:1000000,international:false}});
 const reload=environment(e.data);const card=reload.cards.getCardById('personal','p1');
 assert.equal(card.frozen,true);assert.equal(card.onlineEnabled,false);assert.equal(card.limits.contactless,12.34);
 assert.equal(reload.cards.getCardById('business','b1').frozen,false);
});
test('failed preference writes leave card and goal state unchanged',()=>{
 const e=environment();const card=JSON.stringify(e.cards.getCards('personal'));const goals=JSON.stringify(e.goals.getGoals('personal'));e.fail();
 assert.throws(()=>e.cards.updateCard('personal','p1',{frozen:true}));
 assert.match(e.goals.allocateGoal('personal','vacation','10','add'),/could not save/);
 assert.match(e.goals.saveGoal('personal','New goal','500'),/could not save/);
 assert.equal(JSON.stringify(e.cards.getCards('personal')),card);assert.equal(JSON.stringify(e.goals.getGoals('personal')),goals);assert.equal(e.data.size,0);
});
test('goal allocation preserves the savings total after reload',()=>{
 const e=environment();const total=e.goals.savingsTotal('personal');
 assert.equal(e.goals.allocateGoal('personal','vacation','0.01','add'),'');
 assert.equal(e.goals.allocateGoal('personal','emergency','0.01','release'),'');
 const reload=environment(e.data);const allocated=reload.goals.getGoals('personal').reduce((n,g)=>n+g.current,0);
 assert.equal(Math.round((allocated+reload.goals.unallocatedSavings('personal'))*100),Math.round(total*100));
 assert.equal(reload.goals.getGoalById('personal','vacation').current,1840.01);
});
test('card mutation rejects invalid limits and unknown cards without writing',()=>{
 const e=environment();const before=JSON.stringify(e.cards.getCards('personal'));
 for(const n of [-1,0.001,NaN,Infinity,1000000.01])assert.throws(()=>e.cards.updateCard('personal','p1',{limits:{online:n,contactless:0,atm:0,international:true}}));
 assert.throws(()=>e.cards.updateCard('personal','missing',{frozen:true}));
 assert.throws(()=>e.cards.updateCard('personal','p1',{frozen:'yes'}));
 assert.throws(()=>e.cards.updateCard('personal','p1',{id:'another-card',monthlySpend:0}));
 assert.equal(JSON.stringify(e.cards.getCards('personal')),before);assert.equal(e.data.size,0);
});
test('persisted sub-cent limits fall back without discarding a valid freeze setting',()=>{
 const e=environment(new Map([['zb-product-v1:cards:personal',JSON.stringify([{id:'p1',frozen:true,limits:{online:0.001,contactless:0,atm:0,international:true}}])]]));
 const card=e.cards.getCardById('personal','p1');assert.equal(card.frozen,true);assert.equal(card.limits.online,2000);
});
