const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const ts=require('typescript');
const vm=require('node:vm');
const exportsObject={};
const code=ts.transpileModule(fs.readFileSync('src/app/utils/transferDraft.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
vm.runInNewContext(code,{exports:exportsObject});
const {parseTransferDraft}=exportsObject;
const draft={recipientId:'new',sourceId:'p-main',destinationId:'',amount:'25',note:'Invoice',name:'Test',iban:'DE89370400440532013000',currency:'EUR',save:false};
test('valid draft preserves input including unfinished amount and IBAN',()=>{
 for(const fields of [{},{amount:'',iban:'DE89'},{amount:'0.001',name:''}]){
 const value={...draft,...fields};assert.equal(JSON.stringify(parseTransferDraft(value)),JSON.stringify(value));
 }
});
test('malformed drafts never reach form string operations or selectors',()=>{
 for(const value of [null,[],42,{},...Object.keys(draft).map(key=>({...draft,[key]:null})),{...draft,currency:'euro'},{...draft,save:'false'},{...draft,note:{}},{...draft,name:'x'.repeat(121)}]) assert.equal(parseTransferDraft(value),null);
});
test('unknown fields are not restored into form state',()=>{
 assert.equal(Object.hasOwn(parseTransferDraft({...draft,extra:'ignored'}),'extra'),false);
});

test('draft recovery returns unfinished recipients to details and missing recipients to selection',()=>{
 const step=exportsObject.transferDraftStep;
 assert.equal(step({...draft,iban:'DE89'},false,[]),'new');
 assert.equal(step({...draft,recipientId:'',name:'Half entered'},false,[]),'new');
 assert.equal(step({...draft,recipientId:'saved'},false,['saved']),'amount');
 assert.equal(step({...draft,recipientId:'removed'},false,[]),'recipient');
 assert.equal(step({...draft,recipientId:'',name:'',iban:''},false,[]),'recipient');
 assert.equal(step(draft,true,[]),'amount');
});


test('draft intent is optional for legacy drafts and strictly validated when present',()=>{
 assert.equal(parseTransferDraft({...draft,intentId:'stable-intent'}).intentId,'stable-intent');
 for(const intentId of [null,{},'',42,'x'.repeat(161),'invalid id']) assert.equal(parseTransferDraft({...draft,intentId}),null);
 assert.ok(parseTransferDraft(draft));
});
