// Amber Sap A, shared liquid v1. Isolated provisional policy; no runtime mount.
export const AMBER_SAP_DEFINITION = Object.freeze({id:'amber-sap',gravityLimit:1,lateralLimit:1});
const int=(n,lo,hi)=>Number.isSafeInteger(n)&&n>=lo&&n<=hi;
const point=(x,y,z)=>Number.isSafeInteger(x)&&int(y,-210,256)&&Number.isSafeInteger(z);
function sap(c){return c?.id==='amber-sap'&&point(c.x,c.y,c.z)&&int(c.units,1,8);}

// Read-only signal for Movement and presentation owners. Support is explicitly
// supplied by the host, not inferred from unloaded or obstructed liquid cells.
export function sampleSapContact(engine,x,y,z,{adhesionPermille=500}={}){
  if(typeof engine?.samplePoint!=='function'||!int(adhesionPermille,0,1000))throw new TypeError('Invalid sap contact policy');
  const s=engine.samplePoint(x,y,z);
  if(!s||!sap(s.cell))return null;
  return Object.freeze({id:'amber-sap',fill:s.cell.units/8,stickinessPermille:Math.floor(adhesionPermille*s.cell.units/8)});
}
export function sampleSapRetention(cell,{isLoaded,isSolid}={}){
  if(typeof isLoaded!=='function'||typeof isSolid!=='function')throw new TypeError('Explicit support callbacks required');
  if(!sap(cell)||isLoaded(cell.x,cell.y,cell.z)!==true)return null;
  const faces=[];
  for(const [dx,dy,dz,name] of [[0,-1,0,'bottom'],[1,0,0,'east'],[0,0,1,'south'],[-1,0,0,'west'],[0,0,-1,'north'],[0,1,0,'top']]){
    const p=[cell.x+dx,cell.y+dy,cell.z+dz];
    if(point(...p)&&isLoaded(...p)===true&&isSolid(...p)===true)faces.push(name);
  }
  return Object.freeze({faces:Object.freeze(faces),retained:faces.length>0});
}

// A finite source is explicitly attached to an existing tree by the host.
// No tree discovery, automatic generation, or time-based refill is performed.
export function createSapSource({x,y,z,treeId,stock,rate=1,target=8,snapshot=null}={}){
  if(!point(x,y,z)||typeof treeId!=='string'||!/^[a-zA-Z0-9:_-]{1,80}$/.test(treeId)||!int(stock,0,Number.MAX_SAFE_INTEGER)||!int(rate,1,8)||!int(target,1,8))throw new TypeError('Invalid sap source');
  const signature=JSON.stringify([x,y,z,treeId,stock,rate,target]);
  let remaining=stock,busy=false;
  if(snapshot!==null){
    if(snapshot?.version!==1||snapshot.signature!==signature||!int(snapshot.remaining,0,stock))throw new TypeError('Invalid sap source snapshot');
    remaining=snapshot.remaining;
  }
  function save(){if(busy)throw new Error('Active sap source');return {version:1,signature,remaining};}
  function collect(engine,isTreeAvailable){
    if(busy)throw new Error('Reentrant sap source');
    if(typeof engine?.getCell!=='function'||typeof engine?.insert!=='function'||typeof isTreeAvailable!=='function')throw new TypeError('Explicit source host required');
    busy=true;
    try{
      if(!remaining||isTreeAvailable(treeId,x,y,z)!==true)return 0;
      const c=engine.getCell(x,y,z);
      if(c&&(!sap(c)||c.x!==x||c.y!==y||c.z!==z))return 0;
      const n=Math.min(rate,remaining,Math.max(0,target-(c?.units??0)));
      if(n>0&&engine.insert(x,y,z,'amber-sap',n)===true){remaining-=n;return n;}
      return 0;
    }finally{busy=false;}
  }
  return Object.freeze({collect,save});
}
