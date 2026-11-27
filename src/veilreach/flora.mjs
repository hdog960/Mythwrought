// Compact two-blade ground cover. Collision and selection share these boxes
// with the live chunk mesher, using the existing native shape pipeline.
export const VEILREACH_GRASS_ID=420;
export const veilreachGrass=Object.freeze({
  name:'Veil grass',solid:false,
  boxes:Object.freeze([
    Object.freeze([.28,0,.34,.34,.38,.45]),
    Object.freeze([.58,0,.56,.68,.52,.62])
  ]),
  palette:Object.freeze([
    Object.freeze([.31,.57,.24]),Object.freeze([.50,.66,.28])
  ])
});
export const veilreachGrassColor=(x,y,z,face)=>veilreachGrass.palette[(x^y^z^face)&1];
