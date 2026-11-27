import {chromium} from 'playwright';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
const main=await readFile('.current-source/src/main.mjs','utf8'),i=main.indexOf('  const VS=['),j=main.indexOf('  let program,skyProgram',i);
if(i<0||j<=i)throw Error('Current shader extraction mismatch');
const prefix="import {STORYBOOK_MATERIAL_FRAGMENT_SHADER} from '../storybook-materials.mjs';\nimport * as nonblockGeometry from '../nonblock/candidate-scene.mjs';\nimport {SKY_VERTEX_SHADER,SKY_FRAGMENT_SHADER} from '../sky.mjs';\n";
await writeFile('.current-source/src/manual-biomes/forgotten-sands-color-shaders.mjs',prefix+main.slice(i,j)+"\nexport const P0_ORIGINAL_SHADERS=Object.freeze({terrainVertex:VS,terrainFragment:FS,skyVertex:SKY_VERTEX_SHADER,skyFragment:SKY_FRAGMENT_SHADER});");
const browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
try{
 await mkdir('p0-exchange-evidence',{recursive:true});const page=await browser.newPage({viewport:{width:956,height:440}});
 page.on('console',m=>{if(m.text().startsWith('P0 EXCHANGE STEP'))console.log(m.text());});
 for(const group of [1,3]){
  await page.goto('http://127.0.0.1:8765/tests/forgotten-sands-current-exchange/index.html?group='+group);
  await page.waitForFunction(()=>window.p0Result||window.p0Error,{},{timeout:180000});
  const error=await page.evaluate(()=>window.p0Error);if(error){const p=await page.evaluate(()=>window.p0Partial);if(p){const {images,...details}=p;await writeFile('p0-exchange-evidence/failed-group'+group+'.json',JSON.stringify(details,null,2));for(const [name,data] of Object.entries(images))await writeFile('p0-exchange-evidence/failed-g'+group+'-'+name+'.png',Buffer.from(data.split(',')[1],'base64'));}throw Error(error);}
  const r=await page.evaluate(()=>window.p0Result),images=await page.evaluate(()=>window.p0Images);
  console.log('P0 CURRENT EXCHANGE WEBGL',JSON.stringify(r));await writeFile('p0-exchange-evidence/group'+group+'.json',JSON.stringify(r,null,2));
  for(const [name,data] of Object.entries(images))await writeFile('p0-exchange-evidence/g'+group+'-'+name+'.png',Buffer.from(data.split(',')[1],'base64'));
 }
}finally{await browser.close();}
