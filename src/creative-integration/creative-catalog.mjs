// MYTHWROUGHT authoritative Creative item index for *installed production*
// placement providers. Catalog candidates and environmental-only meshes are
// intentionally excluded until they acquire a real live placement adapter.
import {BUILD_MATERIALS,BLOCK_NAMES} from '../blocks.mjs';
import {BLOCK} from '../voxel.mjs';
import {BIOME130_REGISTERED_IDS,biome130Block} from '../biome130-registry.mjs';
import {PACK2_LIVE_IDS,PACK2_LIVE_NAMES} from '../pack2-integration.mjs';
import {MANUAL_FIVE_PACK_CATALOG} from '../builder-assets/manual-five-pack.mjs';
import {PACK5_BUILDER_CATALOG} from '../pack5-integration/catalog.mjs';
import {speciesRegistry} from '../mobs/species.mjs';

export const CREATIVE_CATEGORIES=Object.freeze([
  ['all','All Blocks'],['terrain','Terrain & Stone'],['wood','Wood & Nature'],
  ['construction','Construction'],['doors','Doors & Windows'],
  ['furniture','Furniture & Interiors'],['decorations','Decorations'],
  ['magical','Magical & Rare'],['water','Water & Specialty'],
  ['creatures','Creatures']
]);
const core=new Set([BLOCK.STONE,BLOCK.WOOD,BLOCK.CRYSTAL,BLOCK.LEAVES,BLOCK.DEEPSTONE]);
const biomes=new Set(BIOME130_REGISTERED_IDS),pack2=new Set(PACK2_LIVE_IDS);
const owners=Object.freeze({core,biomes,pack2});
function categoryFor(name,owner,asset){
  const n=name.toLowerCase();
  if(owner==='pack5')return 'furniture';
  if(owner==='pack4')return /door|window|shutter|hatch|gate|trapdoor/.test(n)?
    'doors':'furniture';
  if(owner==='pack3')return 'construction';
  if(owner==='pack1')return /flower|leaf|grass|moss|mushroom|vine|tree/.test(n)?
    'wood':'terrain';
  if(/door|window|gate|hatch|shutter|trapdoor/.test(n))return 'doors';
  if(/water|fluid|ice/.test(n))return 'water';
  if(/chair|table|bench|lantern|furniture|shelf|fireplace/.test(n))return 'furniture';
  if(/crystal|arcane|enchant|rune|magical|glow/.test(n))return 'magical';
  if(/flower|leaf|wood|timber|plank|log|branch|grass|vine|moss|root|tree/.test(n))return 'wood';
  if(/brick|tile|wall|beam|pillar|roof|stairs|slab|fence|arch|column/.test(n))return 'construction';
  if(/stone|snow|sand|dirt|ore|rock|soil|granite|basalt|clay|deep/.test(n))
    return 'terrain';
  return owner==='core'?'terrain': 'decorations';
}
const label=s=>String(s??'').trim();
const glyphOf=c=>({terrain:'◈',wood:'♧',construction:'▦',doors:'⌑',
  furniture:'▤',decorations:'✥',magical:'✧',water:'≈',creatures:'◉'}[c]??'✦');
function block(id,owner,name,meta={}){
  const category=categoryFor(name,owner,meta);
  if(!Number.isSafeInteger(id)||id<1||!label(name))throw Error('Invalid Creative block metadata');
  return Object.freeze({key:'block:'+id,id,name:label(name),owner,kind:'block',
    category,glyph:glyphOf(category),...meta});
}
export function buildCreativeCatalog(){
  const blocks=[],seen=new Set();
  const add=item=>{
    if(seen.has(item.key))throw Error('Overlapping Creative producer ID '+item.key);
    seen.add(item.key);blocks.push(item);
  };
  // Core, biome130 and Pack2: built-in src/blocks.mjs placement authority.
  for(const id of BUILD_MATERIALS){
    if(core.has(id))add(block(id,'core',BLOCK_NAMES[id]));
    else if(biomes.has(id))add(block(id,'biome130',biome130Block(id).name));
    else if(pack2.has(id))add(block(id,'pack2',PACK2_LIVE_NAMES[id]));
    else throw Error('Unverified active building material '+id);
  }
  const pack5Map=new Map(PACK5_BUILDER_CATALOG.map(x=>[x.symbolicId,x]));
  // Pack2 is already registered in BUILD_MATERIALS: never duplicate it.
  for(const asset of MANUAL_FIVE_PACK_CATALOG.filter(a=>a.pack!==2)){
    const owner='pack'+asset.pack;
    const meta=asset.pack===5?pack5Map.get(asset.symbol):null;
    if(asset.pack===5&&(!meta||!meta.variants.length))
      throw Error('Missing installed Pack5 authored family '+asset.symbol);
    add(block(asset.numericId,owner,asset.name??meta?.name??asset.symbol,
      {symbol:asset.symbol,...(meta?{variants:meta.variants}:{} )}));
  }
  const creatures=speciesRegistry.map(species=>Object.freeze({
    key:'spawn:'+species.id,id:species.id,kind:'spawn',owner:'live-mobs',
    name:species.displayName,classification:species.classification,
    category:'creatures',glyph:'◉'
  }));
  if(new Set(creatures.map(x=>x.key)).size!==creatures.length)
    throw Error('Duplicate Creative mob spawn item');
  // Live production counts: 5 core + 130 biome + 18 Pack2 + 30 Pack1 +
  // 17 Pack3 + 23 Pack4 + 18 Pack5 = 241; exactly 40 creatures.
  if(blocks.length!==241||creatures.length!==40)
    throw Error('Production Creative inventory mismatch: '+blocks.length+' blocks / '+creatures.length+' mobs');
  const records=Object.freeze([...blocks,...creatures]);
  let hash=2166136261;
  const raw=records.map(x=>x.key+':'+x.name).join('|');
  for(let i=0;i<raw.length;i++)hash=Math.imul(hash^raw.charCodeAt(i),16777619);
  return Object.freeze({blocks:Object.freeze(blocks),creatures:Object.freeze(creatures),
    records,revision:'creative:1:'+blocks.length+':'+creatures.length+':'+(hash>>>0).toString(16)});
}
export function filterCreativeItems(catalog,{category='all',search='',classification='all'}={}){
  if(!catalog||!CREATIVE_CATEGORIES.some(x=>x[0]===category)||
      !['all','passive','hostile'].includes(classification))
    throw TypeError('Invalid Creative inventory filter');
  const query=String(search).trim().toLowerCase();
  const items=category==='creatures'?catalog.creatures:catalog.blocks;
  return items.filter(x=>(category==='all'||category==='creatures'||x.category===category)&&
    (classification==='all'||x.kind!=='spawn'||x.classification===classification)&&
    (!query||x.name.toLowerCase().includes(query)||x.key.toLowerCase().includes(query)));
}
