// Curated names from Issues #109/#117 and Pack 5. Expand only by exact roster entry.
// Future candidates have deliberately unknown dimensions, orientation and persistent IDs.
const existing={
  'builtin:grass':'GRASS 1','builtin:dirt':'DIRT 2','builtin:stone':'STONE 3',
  'builtin:wood':'WOOD 4','builtin:crystal':'CRYSTAL 5','builtin:ore':'ORE 6',
  'builtin:leaves':'LEAVES 7','builtin:deepstone':'DEEPSTONE 8'
};
const planned={
  'pack1:002':'Stone bricks','pack1:007':'Stone slabs','pack1:008':'Stone stairs',
  'pack1:009':'Stone walls','pack1:010':'Stone pillars','pack1:011':'Stone arches',
  'pack2:013':'Wooden planks','pack2:015':'Timber beams','pack2:017':'Wooden stairs',
  'pack2:020':'Wooden doors','pack2:022':'Wooden support posts',
  'pack3:023':'Wooden shingles','pack3:025':'Slate roof tiles','pack3:026':'Thatched roofing',
  'pack3:069':'Castle wall blocks','pack3:070':'Battlement blocks','pack3:071':'Stone buttresses',
  'pack4:034':'Iron bars','pack4:035':'Lantern blocks','pack4:063':'Chimney blocks',
  'pack4:064':'Fireplace blocks','pack4:056':'Barrels','pack4:057':'Wooden crates',
  'pack5:079':'Plaster & Stucco','pack5:080':'Fired Brick Masonry',
  'pack5:081':'Ceramic Interior Floor Tiles','pack5:088':'Anvils & Forge Fixtures',
  'pack5:094':'Heavy Gates & Portcullis Panels',
  'biome130:006':'Wind-carved sandstone','biome130:016':'Powder snow',
  'biome130:094':'Insulated snow-region wall cores',
  'biome130:096':'Enchanted livingwood wall ribs',
  'biome130:098':'Mountain cliff-anchor fittings',
  'biome130:101':'Granite','biome130:104':'Basalt'
};
export const ASSET_CATALOG=Object.freeze(Object.fromEntries([
  ...Object.entries(existing).map(([ref,name])=>[ref,Object.freeze({name,kind:'existing',dimensions:[1,1,1],persistentId:Number(name.split(' ').at(-1))})]),
  ...Object.entries(planned).map(([ref,name])=>[ref,Object.freeze({name,kind:'planned',dimensions:null,persistentId:null,orientation:null,source:ref.startsWith('biome')?'issue:117':ref.startsWith('pack5')?'pack5:manifest':'issue:109'})])
]));