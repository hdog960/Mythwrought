// M7 detached browser: no production modules, builder imports, registration,
// network, persistence, edit actions, or place/import buttons.
import {screenBlueprintSnapshot,filterBlueprints,virtualBlueprintWindow} from './blueprint-browser.mjs';
import {syntheticBlueprintSnapshot} from './blueprint-fixture.mjs';
const byId=id=>document.getElementById(id);
const scroller=byId('bpListScroller'),rows=byId('bpListRows'),canvas=byId('bpCanvas');
const catalog=screenBlueprintSnapshot(syntheticBlueprintSnapshot(300));
const options={query:'',biome:'all',kind:'all',size:'all'};
let selectedId=catalog.records[0]?.id||null;
const COL={foundation:'#d2b989',wall:'#8cae9e',roof:'#d09a66',detail:'#ecd39a'};
function draw(entry){
 const ctx=canvas.getContext('2d');if(!ctx)return;
 ctx.clearRect(0,0,320,180);ctx.fillStyle='#2d5050';ctx.fillRect(0,0,320,180);
 ctx.strokeStyle='#76938b';ctx.strokeRect(8,7,304,166);
 if(!entry){ctx.fillStyle='#e4d3a6';ctx.font='14px system-ui';ctx.fillText('No eligible mock blueprint',34,90);return;}
 // Bounded source preview only: at most 96 explicitly supplied voxel markers.
 const cells=[...entry.previewCells].sort((a,b)=>(a.x+a.z+a.y)-(b.x+b.z+b.y));
 const max=Math.max(5,...cells.map(c=>Math.max(c.x,c.z)));const scale=Math.min(12,54/(max+1));
 const cx=157,cy=124;
 for(const cell of cells){
  const px=cx+(cell.x-cell.z)*scale*.9,py=cy+(cell.x+cell.z)*scale*.41-cell.y*scale*.7;
  ctx.fillStyle=COL[cell.type]||'#c3d1be';ctx.fillRect(px,py,Math.max(3,scale),Math.max(3,scale*.9));
  ctx.strokeStyle='#1a373d';ctx.strokeRect(px,py,Math.max(3,scale),Math.max(3,scale*.9));
 }
 ctx.fillStyle='#f3e6bf';ctx.font='11px system-ui';ctx.fillText(`${entry.previewCells.length} bounded preview markers`,12,162);
}
function render(){
 const {total}=filterBlueprints(catalog,{...options,offset:0,limit:1});
 const windowed=virtualBlueprintWindow(catalog,options,scroller.scrollTop,42,scroller.clientHeight||145);
 const selected=catalog.records.find(item=>item.id===selectedId)||null;
 // Selections disappearing under filters are reset to the first eligible match.
 if(!selected||!([selected].filter(r=>(options.biome==='all'||r.biome===options.biome)&&(options.kind==='all'||r.kind===options.kind)&&(options.size==='all'||r.size===options.size)&&
  (!options.query||[r.name,r.id,r.kind,r.biome,r.size].some(s=>s.toLowerCase().includes(options.query.toLowerCase()))))).length){
  selectedId=filterBlueprints(catalog,{...options,limit:1}).items[0]?.id||null;
 }
 byId('bpSummary').textContent=`${total} / ${catalog.acceptedCount} fixture matches`;
 byId('bpExcluded').textContent=`${catalog.excludedCount} rejected`;
 rows.replaceChildren();
 if(!total){const empty=document.createElement('div');empty.className='bp-empty';empty.textContent='No matching eligible samples';rows.appendChild(empty);}
 else for(const record of windowed.items){
  const btn=document.createElement('button');btn.type='button';btn.className='bp-row';btn.setAttribute('role','option');btn.setAttribute('aria-selected',String(record.id===selectedId));btn.dataset.id=record.id;
  const title=document.createElement('span'),sub=document.createElement('span');title.className='bp-name';sub.className='bp-sub';title.textContent=record.name;sub.textContent=`${record.biome} · ${record.kind} · ${record.size}`;
  btn.append(title,sub);btn.addEventListener('click',()=>{selectedId=record.id;render();});rows.appendChild(btn);
 }
 byId('bpListTop').style.height=`${windowed.topSpacer}px`;
 byId('bpListBottom').style.height=`${windowed.bottomSpacer}px`;
 const current=catalog.records.find(x=>x.id===selectedId)||null;
 byId('bpTitle').textContent=current?.name||'No matching sample';
 byId('bpDescription').textContent=current?`${current.biome.toUpperCase()} · ${current.kind.toUpperCase()} · ${current.size.toUpperCase()} · ${current.dependencyCount} resolved dependencies`:'No accepted fixture records match';
 byId('bpStatus').textContent=`M7 · ${catalog.acceptedCount} SYNTHETIC ELIGIBLE / ${catalog.excludedCount} EXCLUDED · NO LIVE BUILDER ASSETS`;
 draw(current);
 const ev=byId('bpEvidence');ev.dataset.eligible=String(catalog.acceptedCount);ev.dataset.excluded=String(catalog.excludedCount);
 ev.dataset.matchCount=String(total);ev.dataset.renderedRows=String(windowed.items.length);ev.dataset.selectedId=selectedId||'';
 ev.dataset.scrollOffset=String(windowed.offset);ev.dataset.runtimeIntegrated='false';ev.dataset.worldWrites='0';
 ev.dataset.saved='false';ev.dataset.fixture='true';ev.dataset.previewCells=String(current?.previewCells.length||0);
}
byId('bpSearch').addEventListener('input',event=>{options.query=event.target.value;scroller.scrollTop=0;render();});
for(const [key,id] of [['biome','bpBiome'],['kind','bpKind'],['size','bpSize']]){
 byId(id).addEventListener('change',event=>{options[key]=event.target.value;scroller.scrollTop=0;render();});
}
scroller.addEventListener('scroll',render,{passive:true});
render();
