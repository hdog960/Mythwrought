// Pure directional height-edge provenance for *real* source-world geometry.
// A cliff can remain straight while the two heights vary along its length.
// Earlier same-height-pair counting incorrectly split such cliffs to length 1.
export function detectHeightShelfRuns(terrain,{
  legacy=terrain,protectedColumns=null,minStep=2,limit=8
}={}){
  if(!Number.isInteger(minStep)||minStep<1||!Number.isInteger(limit)||limit<1)
    throw Error('Invalid shelf-run minimum step or result limit');
  function requireGrid(grid,name,integer){
    if(!Array.isArray(grid)||grid.length<2||
       !Array.isArray(grid[0])||grid[0].length<2)
      throw Error('Invalid '+name+' grid');
    const width=grid[0].length;
    if(grid.length!==terrain.length||width!==terrain[0].length||
       grid.some(row=>!Array.isArray(row)||row.length!==width||
         row.some(v=>integer?!Number.isInteger(v):typeof v!=='boolean')))
      throw Error('Mismatched or invalid '+name+' grid');
  }
  requireGrid(terrain,'actual',true);
  requireGrid(legacy,'legacy',true);
  if(protectedColumns!==null)requireGrid(protectedColumns,'protected',false);
  const H=terrain.length,W=terrain[0].length,found=[];
  for(const axis of ['x','z']){
    const transverse=axis==='x'?W-1:H-1;
    const along=axis==='x'?H:W;
    for(let cross=0;cross<transverse;cross++){
      let current=null;
      function flush(){
        if(!current)return;
        found.push({...current,meanStep:Number((current.totalStep/current.length).toFixed(3))});
        delete found[found.length-1].totalStep;
        current=null;
      }
      for(let j=0;j<=along;j++){
        const coords=axis==='x'?[[cross,j],[cross+1,j]]:
          [[j,cross],[j,cross+1]];
        const [[x,z],[nx,nz]]=coords;
        const delta=j<along?terrain[nz][nx]-terrain[z][x]:0;
        const sign=Math.abs(delta)>=minStep?Math.sign(delta):0;
        if(!sign||current?.sign!==sign)flush();
        if(!sign)continue;
        const legacyDelta=legacy[nz][nx]-legacy[z][x];
        const protects=protectedColumns?
          protectedColumns[z][x]||protectedColumns[nz][nx]:false;
        if(!current)current={axis,sign,start:{x,z},end:{x,z},
          length:0,totalStep:0,maxStep:0,sourceAmplifiedEdges:0,
          protectedTouches:0};
        current.end={x,z};current.length++;
        current.totalStep+=Math.abs(delta);
        current.maxStep=Math.max(current.maxStep,Math.abs(delta));
        current.sourceAmplifiedEdges+=Number(Math.abs(delta)>Math.abs(legacyDelta));
        current.protectedTouches+=Number(protects);
      }
    }
  }
  found.sort((a,b)=>b.length-a.length||b.maxStep-a.maxStep||
    a.axis.localeCompare(b.axis)||a.start.z-b.start.z||a.start.x-b.start.x);
  return {minStep,allRunCount:found.length,longest:found.slice(0,limit)};
}
