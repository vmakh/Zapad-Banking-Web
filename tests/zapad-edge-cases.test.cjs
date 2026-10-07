const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const vm = require('node:vm');
function load(file) {
  const filename = path.resolve('src/app/utils', file + '.ts');
  const exports = {};
  const code = ts.transpileModule(fs.readFileSync(filename,'utf8'), { compilerOptions: {module:ts.ModuleKind.CommonJS} }).outputText;
  vm.runInNewContext(code, {exports, require:id=>load(id.replace('./','')), URLSearchParams, Number, Math});
  return exports;
}
const {canReviewPayment} = load('paymentQuote');
const {validMoney,goalError,allocationError} = load('goalRules');
const source={id:'a',currency:'EUR',balance:100};
const target={id:'b',currency:'EUR'};
test('payments reject sub-cent, exponent, negative, blank and over-balance amounts',()=>{
 for(const amount of ['0.001','1e1','-1','','0','100.01']) assert.equal(canReviewPayment(amount,source,target,true),false,amount);
 assert.equal(canReviewPayment('100.00',source,target,true),true);
 assert.equal(canReviewPayment('100',source,target,false),false,'fee must fit');
 assert.equal(canReviewPayment('1',source,source,true),false);
 assert.equal(canReviewPayment('1',source,{id:'b',currency:'USD'},true),false);
 assert.equal(canReviewPayment('1',source,undefined),false);
});
test('goal boundary validation and allocation conservation',()=>{
 assert.equal(validMoney('0.01'),true); assert.equal(validMoney('100000000'),true);
 for(const v of ['0.001','1e4','Infinity','100000000.01','-1']) assert.equal(validMoney(v),false,v);
 assert.ok(goalError(' ','10')); assert.ok(goalError('a'.repeat(61),'10'));
 assert.ok(goalError('Goal','9',10)); assert.equal(goalError('a'.repeat(60),'10',10),'');
 assert.ok(allocationError('10.01','release',10,20,10));
 assert.ok(allocationError('10.01','add',10,20,10));
 assert.equal(allocationError('10','add',10,20,10),'');
});
test('privacy masks notification amounts without removing dates or invoice numbers',()=>{
 const {maskMoneyInText}=load('privacyText');
 assert.equal(maskMoneyInText('INV-2034: €4,820.00, May 11; $20.50 / £0.01'),'INV-2034: •••, May 11; ••• / •••');
});
test('loan estimates never expose infinite totals',()=>{
 const {loanEstimate}=load('loanMath');
 assert.equal(loanEstimate(1e308,100,1000),null);
});

test('payments cannot review a missing or unavailable funding account',()=>{
 assert.equal(canReviewPayment('10',undefined,target),false);
 assert.equal(canReviewPayment('10',{...source,balance:NaN},target),false);
 assert.equal(canReviewPayment('10',{...source,balance:Infinity},target),false);
});

test('spending drilldown excludes non-posted, income, FX and other currencies',()=>{
 const {isSpendingTransaction,spendingHref}=load('spending');
 const base={status:'Completed',currency:'EUR',category:'Shopping',amount:-42.18};
 assert.equal(isSpendingTransaction(base),true);
 for(const patch of [{status:'Pending'},{status:'Scheduled'},{status:'Waiting for approval'},{amount:10},{amount:0},{amount:NaN},{currency:'USD'},{category:'Exchange'}]) assert.equal(isSpendingTransaction({...base,...patch}),false);
 assert.equal(spendingHref('/personal/transactions'),'/personal/transactions?view=spending');
 assert.equal(spendingHref('/business/transactions?account=b-operating','Food & drink'),'/business/transactions?account=b-operating&view=spending&category=Food+%26+drink');
});

test('activity resolves incompatible deep-link filters visibly without hiding spending',()=>{
 const {activityFilters}=load('activityFilters');
 const resolve=query=>activityFilters(new URLSearchParams(query),['p-main'],['Food']);
 const spending=resolve('view=spending&status=Pending');
 assert.equal(spending.status,'Completed'); assert.equal(spending.invalid,true);
 assert.equal(resolve('view=spending').invalid,false);
 assert.equal(resolve('view=spending&category=Food').category,'Food');
 for(const query of ['view=unknown','category=Food','view=spending&category=missing','account=b-operating','status=invalid']) assert.equal(resolve(query).invalid,true,query);
 assert.equal(resolve('status=Pending').status,'Pending');
 const {spendingHref}=load('spending');
 assert.equal(spendingHref('/personal/transactions?status=Pending&search=salary&transaction=3&preview=old'),'/personal/transactions?view=spending');
});

test('card limit validation explains missing values and rejects out-of-range or sub-cent input',()=>{
 const {cardLimitError}=load('cardLimit');
 for(const value of ['0','0.00','777.25','1000000']) assert.equal(cardLimitError(value),'');
 for(const value of ['',' ','-1','1e3','NaN','Infinity','1.001','1000000.01']) assert.ok(cardLimitError(value),value);
 assert.match(cardLimitError(''),/Enter a daily limit/);
 assert.match(cardLimitError('1000000.01'),/maximum/);
});

test('exchange retains the exact account and never substitutes invalid deep-link accounts',()=>{
 const {resolveExchangeAccounts}=load('exchangeAccounts');
 const accounts=[{id:'main',currency:'EUR',balance:200},{id:'savings',currency:'EUR',balance:50},{id:'usd',currency:'USD',balance:0}];
 const selected=resolveExchangeAccounts(accounts,'savings',null);
 assert.equal(selected.source.id,'savings');
 assert.equal(selected.source.balance,50);
 assert.equal(selected.destination.id,'usd');
 assert.equal(resolveExchangeAccounts(accounts,'foreign',null).source,undefined);
 assert.equal(resolveExchangeAccounts(accounts,'foreign',null).invalidLink,true);
 assert.equal(resolveExchangeAccounts(accounts,'main','missing').destination,undefined);
 assert.equal(resolveExchangeAccounts(accounts,'main','missing').invalidLink,true);
 assert.equal(resolveExchangeAccounts(accounts,'',null).source,undefined);
 assert.equal(resolveExchangeAccounts([],null,null).source,undefined);
 assert.equal(resolveExchangeAccounts([accounts[0]],null,null).destination,undefined);
 assert.equal(resolveExchangeAccounts(accounts,null,null).source.id,'main');
 assert.equal(resolveExchangeAccounts(accounts,'usd','savings').destination.id,'savings');
});

test('decimal entry preserves cents and rejects ambiguous or malformed amounts',()=>{
 const {normalizeDecimalInput}=load('decimalInput');
 for (const [input,expected] of [['100,50','100.50'],['0,01','0.01'],['100.50','100.50'],['100,','100.'],['','']]) assert.equal(normalizeDecimalInput(input),expected);
 for (const input of ['1,234','1,234.56','1.234,56','1 234,56','100,5,0','1e3','-5,00']) assert.equal(validMoney(normalizeDecimalInput(input)),false,input);
 const amount=normalizeDecimalInput('97,51');
 assert.equal(canReviewPayment(amount,source,target,false),true,'amount plus €2.49 fee fits exactly');
 assert.equal(canReviewPayment(normalizeDecimalInput('97,52'),source,target,false),false,'one cent over the balance');
 assert.equal(Number(normalizeDecimalInput('100,50')),100.50);
});

test('loan calculator distinguishes missing interest from an explicit zero rate',()=>{
 const {loanInputErrors,loanEstimate}=load('loanMath');
 assert.notEqual(loanInputErrors('10000','','36').rate,'');
 assert.notEqual(loanInputErrors('10000',' ','36').rate,'');
 assert.equal(loanInputErrors('10000','0','36').rate,'');
 assert.equal(loanEstimate(10000,0,36).interest,0);
 for(const [field,values] of [['principal',['','5.2','36']],['principal',['0','5.2','36']],['principal',['1.001','5.2','36']],['rate',['100','-1','36']],['months',['100','5.2','1.5']],['months',['100','5.2','0']],['months',['100','5.2','1e3']]]) assert.ok(loanInputErrors(...values)[field]);
 assert.equal(Object.values(loanInputErrors('10000.50','5.2','36')).some(Boolean),false);
});

test('payment exit restores only a known origin and profile-owned account',()=>{
 const {paymentReturnPath}=load('paymentOrigin');
 const resolve=(query,profile='personal',ids=['p-main','p-usd'])=>paymentReturnPath(profile,new URLSearchParams(query),ids);
 assert.equal(resolve('origin=home&source=p-usd'),'/personal?account=p-usd');
 assert.equal(resolve('origin=accounts&source=p-main'),'/personal/accounts/p-main');
 assert.equal(resolve('origin=accounts&source=b-operating','business',['b-operating']),'/business/accounts/b-operating');
 for(const query of ['','source=p-main','origin=home','origin=home&source=b-operating','origin=https://example.com&source=p-main','origin=accounts&source=../business']) assert.equal(resolve(query),null,query);
});

test('clipboard result waits for completion and reports unsupported or rejected writes',async()=>{
 const {copyText}=load('clipboard');
 let finish;
 let settled=false;
 const result=copyText('ME25 demo',{writeText:text=>{assert.equal(text,'ME25 demo');return new Promise(resolve=>{finish=resolve;});}}).then(value=>{settled=true;return value;});
 await Promise.resolve();assert.equal(settled,false);
 finish();assert.equal(await result,true);
 assert.equal(await copyText('demo',{writeText:async()=>{throw new Error('NotAllowedError');}}),false);
 assert.equal(await copyText('demo',{writeText:()=>{throw new Error('Unavailable');}}),false);
 assert.equal(await copyText('demo',undefined),false);
});

test('exchange return context stays independent of current source and target',()=>{
 const {exchangeReturnPath}=load('paymentOrigin');
 const resolve=query=>exchangeReturnPath('personal',new URLSearchParams(query),['p-main','p-usd','p-savings']);
 assert.equal(resolve('origin=home&originAccount=p-savings&source=p-usd&target=p-main'),'/personal?account=p-savings');
 for(const query of ['source=p-main','origin=home&source=p-main','origin=home&originAccount=b-operating','origin=https://example.com&originAccount=p-main']) assert.equal(resolve(query),null);
});

test('savings estimates reject overflow and preserve zero-deposit and zero-rate cases',()=>{
 const {savingsEstimate}=load('savingsMath');
 assert.ok(Math.abs(savingsEstimate(5000,3.2,1).finalAmount-5160)<1e-8);
 assert.equal(savingsEstimate(5000,0,10).interest,0);
 assert.equal(savingsEstimate(5000,100,0).finalAmount,5000);
 assert.equal(savingsEstimate(0,100,10000).finalAmount,0);
 for(const args of [[5000,100,10000],[1e308,3.2,1],[5000,Infinity,1],[5000,-1,1],[5000,3.2,-1]]) assert.equal(savingsEstimate(...args),null);
});
