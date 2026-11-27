// Wilds art-owned palette specification. Symbolic until shared numeric ID
// ownership, save validator and renderer registration are coordinated.
// Full cube geometry; pigment is not a light emitter or shader override.
const rows=[
 ['starbark','Starspire silver-veined bark',[.29,.32,.39],0],
 ['heartbark','Ancient heartwood bark',[.29,.23,.29],0],
 ['moonbark','Moonwillow silver bark',[.51,.63,.65],0],
 ['dawnbark','Dawnheart ivory bark',[.72,.66,.50],0],
 ['emerald','Heartwood emerald foliage',[.20,.47,.34],0],
 ['teal','Starspire teal foliage',[.19,.53,.49],0],
 ['moonleaf','Moonveil blue foliage',[.35,.55,.69],0],
 ['amethyst','Amethyst crown foliage',[.48,.31,.65],0],
 ['dawnleaf','Dawnheart golden-green foliage',[.56,.65,.36],0],
 ['ivory-stalk','Ivory fungal stalk',[.76,.73,.61],0],
 ['violet-cap','Velvet violet cap',[.43,.25,.58],0],
 ['indigo-cap','Titanveil indigo cap',[.22,.27,.45],0],
 ['teal-cap','Lumenspire teal cap',[.17,.51,.48],0],
 ['silver-gill','Silver fungal gills',[.62,.79,.76],0],
 ['gold-gill','Ivory Spiral gold gills',[.82,.67,.38],0],
 ['starlight','Sparse star-sap accent',[.77,.94,.84],.42]
];
export const WILDS_MATERIALS=Object.freeze(rows.map(([key,name,rgb,emissionIntent])=>Object.freeze({symbol:'wilds:'+key,name,rgb:Object.freeze(rgb),emissionIntent,solid:true,shape:'full-cube'})));
const byKey=new Map(WILDS_MATERIALS.map(m=>[m.symbol.slice(6),m]));
const families=[
 ['starbark','teal','moonleaf','starlight'],
 ['moonbark','moonleaf','teal','starlight'],
 ['heartbark','emerald','teal','starlight'],
 ['heartbark','amethyst','moonleaf','starlight'],
 ['dawnbark','dawnleaf','emerald','starlight'],
 ['ivory-stalk','teal-cap','silver-gill','starlight'],
 ['ivory-stalk','violet-cap','silver-gill','starlight'],
 ['ivory-stalk','teal-cap','silver-gill','starlight'],
 ['ivory-stalk','violet-cap','gold-gill','starlight'],
 ['ivory-stalk','indigo-cap','silver-gill','starlight']
];
export function wildsFamilyPalette(id){
 if(!Number.isInteger(id)||!families[id])throw Error('Unknown Wilds family palette');
 const [stem,crown,secondary,accent]=families[id].map(k=>byKey.get(k));
 return Object.freeze({stem,crown,secondary,accent});
}
// Integration must explicitly map every symbol to an owner-approved,
// distinct, unused ID; no provisional number becomes a durable save ID.
export function bindWildsMaterialIds(mapping,isReserved){
 if(!mapping||typeof isReserved!=='function'||Object.keys(mapping).length!==WILDS_MATERIALS.length)throw Error('Complete coordinated material assignment required');
 const seen=new Set(),result=new Map();
 for(const m of WILDS_MATERIALS){
  const id=mapping[m.symbol];
  if(!Number.isSafeInteger(id)||id<209||id>65534||id===255||seen.has(id)||isReserved(id))throw Error('Unapproved or conflicting Wilds ID: '+m.symbol);
  seen.add(id);result.set(id,m);
 }
 return result;
}
