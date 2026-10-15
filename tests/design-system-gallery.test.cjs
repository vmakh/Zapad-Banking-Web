const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const ts=require('typescript');
function load(name){const file=path.resolve('src/app/design-system',name+'.ts');const module={exports:{}};const code=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;vm.runInNewContext(`(function(exports,module){${code}\n})`)(module.exports,module);return module.exports;}
function files(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(path.join(dir,e.name)):[path.join(dir,e.name)]);}
test('gallery covers every existing component module with unique valid sections and states',()=>{
 const {gallerySections}=load('catalogue');
 assert(gallerySections.length>40);
 const ids=gallerySections.map(s=>s.id);assert.equal(new Set(ids).size,ids.length);
 for(const section of gallerySections){assert(section.title&&section.group&&section.description);assert(section.states.length);assert.equal(new Set(section.states).size,section.states.length);}
 const covered=new Set(gallerySections.flatMap(s=>s.modules));
 const actual=files('src/app/components').filter(f=>f.endsWith('.tsx')).map(f=>path.relative('src/app/components',f).replace(/\.tsx$/,'').split(path.sep).join('/'));
 for(const file of actual)assert(covered.has(file),`Missing gallery specimen: ${file}`);
});
test('invalid gallery selection recovers to a valid foundation without accepting unknown profiles',()=>{
 const {resolveGallerySelection}=load('catalogue');
 const selected=resolveGallerySelection('unknown','broken','admin');assert.equal(selected.section.id,'colors');assert.equal(selected.state,'default');assert.equal(selected.context,'compare');
 const business=resolveGallerySelection('button','disabled','business');assert.equal(business.state,'disabled');assert.equal(business.context,'business');
});
test('preview storage supports the Storage API without reading or writing device data',()=>{
 const {createPreviewStorage}=load('previewStorage');const a=createPreviewStorage(),b=createPreviewStorage();a.setItem('draft','125');assert.equal(a.getItem('draft'),'125');assert.equal(b.getItem('draft'),null);assert.equal(a.length,1);assert.equal(a.key(0),'draft');a.removeItem('draft');assert.equal(a.length,0);a.setItem('locale','uk');a.clear();assert.equal(a.getItem('locale'),null);
});
