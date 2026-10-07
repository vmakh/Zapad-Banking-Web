const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const ts=require('typescript');
const vm=require('node:vm');
const root=path.resolve(__dirname,'../src/app');
function environment(){
 const data=new Map();let fail=false;const cache=new Map();
 const storage={getItem:k=>data.get(k)??null,setItem:(k,v)=>{if(fail)throw Error('quota');data.set(k,v);},removeItem:k=>data.delete(k),key:i=>[...data.keys()][i],get length(){return data.size;}};
 function load(file){if(cache.has(file))return cache.get(file).exports;const mod={exports:{}};cache.set(file,mod);const code=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;vm.runInNewContext(`(function(require,module,exports){${code}\n})`,{localStorage:storage})(name=>load(path.resolve(path.dirname(file),name+'.ts')),mod,mod.exports);return mod.exports;}
 return {storage,recovery:load(path.join(root,"utils/transferRecovery.ts")).getTransferRecovery,write:load(path.join(root,"utils/demoStorage.ts")).writeDemo,model:load(path.join(root,'utils/paymentPreview.ts')),recipients:load(path.join(root,'data/recipients.ts')),reset:load(path.join(root,'utils/demoStorage.ts')).resetDemoProfile,quote:load(path.join(root,'utils/paymentQuote.ts')),fail:()=>{fail=true;}};
}
const record=(overrides={})=>({id:'stable-intent',kind:'personal',createdAt:'2026-09-29T12:00:00Z',title:'Transfer',sourceId:'p-main',source:'Main',recipient:'Test Recipient',iban:'DE89370400440532013000',amount:25,currency:'EUR',fee:2.49,total:27.49,received:25,targetCurrency:'EUR',note:'Test',status:'Preview saved',initiator:'Alex Demo',events:['Reviewed'],...overrides});
test('IBAN normalization, country length and mod-97 validation',()=>{const {model:m}=environment();assert.equal(m.normalizeIban('de89 3704 0044 0532 0130 00'),'DE89370400440532013000');assert.equal(m.ibanError('de89 3704 0044 0532 0130 00'),'');assert.notEqual(m.ibanError('DE88370400440532013000'),'');assert.notEqual(m.ibanError('DE8937040044053201300'),'');assert.notEqual(m.ibanError('ZZ89370400440532013000'),'');});
test('stable intent persists exactly once; lost-response check resolves same record',()=>{const {model:m}=environment();m.savePreview(record({status:'Status unknown'}));m.savePreview(record());assert.equal(m.getPreviews('personal').length,1);assert.equal(m.getPreviews('personal')[0].status,'Status unknown');m.resolvePreview('personal','stable-intent','check','Alex Demo');assert.equal(m.getPreviews('personal')[0].status,'Preview saved');assert.equal(m.getPreviews('business').length,0);});
test('approval forbids initiator, requires rejection reason, and never releases payment',()=>{const {model:m}=environment();m.savePreview(record({kind:'business',initiator:'Creator',status:'Awaiting approval'}));assert.throws(()=>m.resolvePreview('business','stable-intent','approve','Creator'));assert.throws(()=>m.resolvePreview('business','stable-intent','reject','Reviewer',' '));m.resolvePreview('business','stable-intent','reject','Reviewer','Wrong invoice');m.resolvePreview('business','stable-intent','approve','Reviewer');assert.equal(m.getPreviews('business')[0].status,'Rejected preview');assert.equal(m.getPreviews('business')[0].reason,'Wrong invoice');});
test('storage failure cannot report success',()=>{const e=environment();e.fail();assert.throws(()=>e.model.savePreview(record()));assert.equal(e.model.getPreviews('personal').length,0);});
test('recipient duplicate matches normalized IBAN, not name; profile reset is isolated',()=>{const e=environment();const recipient={id:'custom-1',name:'Same name',iban:'DE89 3704 0044 0532 0130 00',currency:'EUR',initials:'SN',color:'',bank:'',lastSent:''};e.recipients.saveRecipient('personal',recipient);e.recipients.saveRecipient('personal',{...recipient,id:'custom-2',iban:'de89370400440532013000'});assert.equal(e.recipients.getRecipients('personal').length,4);e.recipients.saveRecipient('personal',{...recipient,id:'custom-3',iban:'GB82WEST12345698765432'});assert.equal(e.recipients.getRecipients('personal').length,5);e.model.savePreview(record());e.model.savePreview(record({kind:'business'}));e.reset('personal');assert.equal(e.model.getPreviews('personal').length,0);assert.equal(e.model.getPreviews('business').length,1);assert.equal(e.recipients.getRecipients('personal').length,3);});
test('review requires amount plus fee and distinct same-currency own accounts',()=>{const {quote:q}=environment();const source={id:'a',currency:'EUR',balance:25};assert.equal(q.canReviewPayment('25',source,{id:'b',currency:'EUR'}),false);assert.equal(q.canReviewPayment('22.51',source,{id:'b',currency:'EUR'}),true);assert.equal(q.canReviewPayment('5',source,source,true),false);assert.equal(q.canReviewPayment('5',source,{id:'b',currency:'USD'},true),false);assert.equal(q.canReviewPayment('-1',source,{id:'b',currency:'EUR'}),false);});
test('business lost response still requires approval after recovery',()=>{const {model:m}=environment();m.savePreview(record({kind:'business',status:'Status unknown'}));m.resolvePreview('business','stable-intent','check','Reviewer');assert.equal(m.getPreviews('business')[0].status,'Awaiting approval');});
test('quote requires review and expires exactly at sixty seconds',()=>{const {model:m}=environment();assert.equal(m.isQuoteExpired(0,1000),true);assert.equal(m.isQuoteExpired(1000,60999),false);assert.equal(m.isQuoteExpired(1000,61000),true);});
test('invalid preview totals cannot enter local history',()=>{const {model:m}=environment();assert.throws(()=>m.savePreview(record({total:25})));assert.throws(()=>m.savePreview(record({amount:NaN})));assert.throws(()=>m.savePreview(record({amount:-25})));assert.equal(m.getPreviews('personal').length,0);});

test('corrupt persisted entries cannot crash history or leak across profiles',()=>{
 const e=environment();
 const invalid=[null,42,[],record({id:'missing-name',recipient:null}),record({id:'bad-currency',currency:{}}),record({id:'bad-date',createdAt:'yesterday'}),record({id:'bad-status',status:'Sent'}),record({id:'bad-event',events:[{}]}),record({id:'bad-amount',amount:'25'}),record({id:'wrong-total',total:30}),record({id:'wrong-profile',kind:'business'})];
 e.storage.setItem('zb-product-v1:previews:personal',JSON.stringify([...invalid,record()]));
 const result=e.model.getPreviews('personal');
 assert.equal(result.length,1);assert.equal(result[0].id,'stable-intent');
});
test('write boundary rejects invalid metadata as well as invalid amounts',()=>{
 const {model:m}=environment();
 for(const bad of [{recipient:' '},{currency:'euro'},{targetCurrency:''},{createdAt:'invalid'},{source:{}},{events:[null]},{status:'Sent'}])assert.throws(()=>m.savePreview(record(bad)));
 assert.equal(m.getPreviews('personal').length,0);
});
test('invalid JSON and wrong storage shape fall back to empty history',()=>{
 const e=environment();
 for(const raw of ['{','null','{}','"text"']){e.storage.setItem('zb-product-v1:previews:personal',raw);assert.equal(e.model.getPreviews('personal').length,0);}
});

const savedRecipient=(overrides={})=>({id:'custom-valid',name:'Demo recipient',iban:'DE89370400440532013000',currency:'EUR',initials:'DR',color:'bg-muted text-muted-foreground',bank:'Not verified',lastSent:'',...overrides});
test('saved recipient reader excludes corrupt fields and invalid payment details',()=>{
 const e=environment();
 const malformed=[null,[],42,...['id','name','iban','currency','initials','color','bank','lastSent'].map(field=>savedRecipient({[field]:{}})),savedRecipient({name:' '}),savedRecipient({name:'x'.repeat(121)}),savedRecipient({iban:'DE88370400440532013000'}),savedRecipient({currency:'EURX'}),savedRecipient({id:'2'})];
 e.storage.setItem('zb-product-v1:recipients:personal',JSON.stringify([...malformed,savedRecipient()]));
 const result=e.recipients.getRecipients('personal');
 assert.equal(result.length,4);assert.equal(result[3].id,'custom-valid');
 assert.equal(e.recipients.getRecipients('business').length,4);
});
test('saved recipient reader removes duplicate IDs and normalized IBANs',()=>{
 const e=environment();
 e.storage.setItem('zb-product-v1:recipients:personal',JSON.stringify([savedRecipient(),savedRecipient({id:'custom-duplicate',iban:'de89 3704 0044 0532 0130 00'}),savedRecipient({iban:'GB82WEST12345698765432'})]));
 const custom=e.recipients.getRecipients('personal').filter(r=>r.id.startsWith('custom-'));
 assert.equal(custom.length,1);assert.equal(custom[0].iban,'DE89370400440532013000');
});
test('recipient write rejects malformed records, ID collisions and storage failure',()=>{
 const e=environment();
 for(const bad of [{name:''},{initials:{}},{iban:'not-an-iban'},{currency:'ZZZ'},{id:'1'}])assert.throws(()=>e.recipients.saveRecipient('personal',savedRecipient(bad)));
 e.recipients.saveRecipient('personal',savedRecipient());
 assert.throws(()=>e.recipients.saveRecipient('personal',savedRecipient({iban:'GB82WEST12345698765432'})));
 assert.equal(e.recipients.getRecipients('personal').length,4);
 e.fail();assert.throws(()=>e.recipients.saveRecipient('business',savedRecipient()));
 assert.equal(e.recipients.getRecipients('business').length,4);
});


test('failed draft cleanup recovers the committed intent instead of offering another transfer',()=>{
 const e=environment();
 const draft={intentId:'stable-intent',recipientId:'new',sourceId:'p-main',destinationId:'',amount:'25',note:'Test',name:'Test',iban:'DE89370400440532013000',currency:'EUR',save:false};
 assert.equal(e.write('draft:personal:send',draft),true);
 assert.equal(e.recovery('personal','send').record,null);
 e.model.savePreview(record());
 e.fail();
 assert.equal(e.write('draft:personal:send',null),false);
 assert.equal(e.recovery('personal','send').record.id,'stable-intent');
 assert.equal(e.model.getPreviews('personal').length,1);
 assert.equal(e.recovery('business','send').record,null);
 assert.equal(e.recovery('personal','transfer').record,null);
});

test('stale draft recovery preserves unknown and business approval states',()=>{
 for(const [kind,status] of [['personal','Status unknown'],['business','Awaiting approval'],['business','Rejected preview']]){
  const e=environment();
  e.write(`draft:${kind}:send`,{intentId:'stable-intent',recipientId:'new',sourceId:'p-main',destinationId:'',amount:'25',note:'',name:'Test',iban:'DE89370400440532013000',currency:'EUR',save:false});
  e.model.savePreview(record({kind,status}));
  e.fail();
  const recovered=e.recovery(kind,'send');
  assert.equal(recovered.record.status,status);
  assert.equal(recovered.record.id,'stable-intent');
 }
});
