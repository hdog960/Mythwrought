import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const html=read('index.html'),src=read('src/main.mjs'),css=read('styles.css');
const worker=read('sw-m5.js'),updater=read('src/app-update.mjs');
const menu=html.slice(html.indexOf('<div id="help" hidden>'),html.indexOf('<script type="module"'));
const primary=menu.split('<details id="advancedMenu">')[0],advanced=menu.split('<div id="advancedTools">')[1];
test('compact default menu retains requested controls without old generators or diagnostics',()=>{
  for(const id of ['closeHelp','skySetDay','skySetNight','newWorld','newSnowWorld','seedInput','switchWorld'])assert.ok(primary.includes('id="'+id+'"'),id);
  for(const id of ['runAudit','caveCreateWorld','caveLoadWorld','pack2Materials','vaultBackup','mirrorSync','renderPreset','checkGameUpdate'])assert.ok(!primary.includes('id="'+id+'"')&&advanced.includes('id="'+id+'"'),id);
  assert.ok(!html.includes('id="g2bFlightProfile"'));
  assert.ok(menu.includes('<details id="advancedMenu">'));
});
test('HUD creative checkbox and REC are siblings within world header',()=>{
  const header=html.match(/<header class="bezel">[\s\S]*?<\/header>/)[0];
  assert.ok(header.includes('id="g2bFlightEnable"')&&header.includes('id="captureToggle"'));
  assert.ok(src.includes("selectG2FlightProfile(active,'travel')"));
  assert.ok(!src.includes('g2Profile'));
});
test('runtime generated legacy and palette controls remain in Advanced',()=>{
  assert.ok(src.includes("const seedRow=document.getElementById('legacyWorldTools')"));
  assert.ok(src.includes("document.getElementById('advancedTools').append(mobActions)"));
  assert.ok(src.includes("document.getElementById('advancedTools').append(pack3Palette.material.closest('.looksetting'))"));
  assert.ok(css.includes('.helpbody.compact-menu'));
  assert.ok(src.includes("document.getElementById('advancedMenu').open=false"));
});
test('release ID matches HTML, updater and existing worker cache',()=>{
  const release='20261124-snow-p1-v1';
  assert.ok(html.includes('data-mw-release="'+release+'"'));
  assert.ok(html.includes('styles.css?mw-release='+release));
  assert.ok(html.includes('src/main.mjs?mw-release='+release));
  assert.ok(updater.includes("GAME_RELEASE='"+release+"'"));
  assert.ok(worker.includes("ASSET_RELEASE='"+release+"'"));
  assert.ok(worker.includes("CACHE_NAME=CACHE_PREFIX+'"+release+"'"));
});
function fixture({candidates=[179,2026,7654321],cancel=false,saveOK=true,writeOK=true,readOnly=false,allClaimed=false}={}){
  const begin=src.indexOf('  function createLatestMenuWorld(next){');
  const end=src.indexOf("  document.getElementById('switchWorld').onclick=",begin);
  assert.ok(begin>=0&&end>begin);
  const calls=[],seedMessage={textContent:''},newWorld={},createEnchantedButton={},seedInput={value:'179'};
  const world={seed:179},storage={};
  const newSnowWorld={};
  const document={getElementById:id=>{assert.ok(['newWorld','newSnowWorld'].includes(id));return id==='newWorld'?newWorld:newSnowWorld}};
  const crypto={getRandomValues:a=>{a[0]=candidates.shift()??179;return a}};
  const expected='latest-enchanted-profile';
  const latest={world:{seed:7654321},base:{generationProfile:{generator:expected}}};
  Function('world','localStorage','window','storageReadOnly','save','rejectLegacyWorldWhereCaveExists','readFourRegionProfile','isUnclaimedWorldSeed','planM2WorldChoice','M2_WORLD_MODE','openM2World','saveM2World','enterPreparedM2World','ENCHANTED_P2_GENERATOR','createEnchantedButton','seedInput','seedMessage','worldSeedFromText','document','crypto',src.slice(begin,end))(
    world,storage,{confirm:text=>{calls.push(['confirm',text]);return !cancel}},readOnly,()=>{calls.push(['save-old']);return saveOK},
    (_,n)=>calls.push(['cave-guard',n]),(_,n)=>n===2026?{}:null,
    (_,n)=>!allClaimed&&n===7654321,
    (seed,mode,flags)=>{calls.push(['plan',seed,mode,flags.confirmed]);return {seed,mode}},
    {CREATE_ENCHANTED_P2:'new-latest'},
    (_,choice)=>{calls.push(['open',choice.seed]);return latest},
    ()=>{calls.push(['save-new']);return {ok:writeOK,reason:'fixture write refused'}},
    (_,status)=>calls.push(['enter',status]),expected,createEnchantedButton,seedInput,seedMessage,Number,document,crypto);
  return {click:()=>newWorld.onclick(),calls,seedMessage};
}
test('NEW WORLD skips current and claimed seeds then uses only current newest generator',()=>{
  const f=fixture();f.click();
  assert.deepEqual(f.calls.find(x=>x[0]==='plan'),['plan','7654321','new-latest',true]);
  assert.deepEqual(f.calls.map(x=>x[0]),['cave-guard','confirm','save-old','plan','open','save-new','enter']);
});
test('cancel NEW WORLD before creating or saving any new seed',()=>{
  const f=fixture({cancel:true});f.click();
  assert.deepEqual(f.calls.map(x=>x[0]),['cave-guard','confirm']);
});
test('old save refusal prevents latest world activation',()=>{
  const f=fixture({saveOK:false});f.click();
  assert.ok(!f.calls.some(x=>x[0]==='open'));
  assert.match(f.seedMessage.textContent,/Save current world/);
});
test('new save refusal never enters candidate world',()=>{
  const f=fixture({writeOK:false});f.click();
  assert.ok(f.calls.some(x=>x[0]==='save-new'));
  assert.ok(!f.calls.some(x=>x[0]==='enter'));
  assert.match(f.seedMessage.textContent,/not verified/);
});
test('bounded random search never creates claimed seed',()=>{
  const f=fixture({allClaimed:true});f.click();
  assert.deepEqual(f.calls,[]);
  assert.match(f.seedMessage.textContent,/unused seed/);
});
