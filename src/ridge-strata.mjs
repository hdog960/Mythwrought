// Render-only geological bedding on genuine exposed highland stone walls.
// Never alters seeded voxels, collision, saves or traversable cave openings.
const fract=n=>n-Math.floor(n);
const hash=(x,z,s)=>fract(Math.sin(x*127.1+z*311.7+s*0.013)*43758.5453);
export function ridgeStrataVertices(world,cx,cz,{chunkSize=16,heightAt,stone=3,air=0}={}){
  if(typeof heightAt!=='function')throw Error('heightAt required');
  const out=[],seed=world.seed|0;
  const faces=[[1,0],[-1,0],[0,1],[0,-1]];
  const emit=(a,b,c,color)=>{
    for(const p of [a,b,c])out.push(...p,...color,0,0,stone);
  };
  // Bounded, sparse, world-coordinate sampling prevents cloned chunk stamps.
  for(let x=cx*chunkSize;x<(cx+1)*chunkSize;x++)
    for(let z=cz*chunkSize;z<(cz+1)*chunkSize;z++){
      const top=heightAt(x,z,seed);
      if(top<9||hash(x,z,seed+911)>.33)continue;
      for(const [dx,dz] of faces){
        const adjacent=heightAt(x+dx,z+dz,seed);
        if(top-adjacent<3)continue;
        const y=Math.min(top-3,Math.max(2,adjacent+1));
        if(world.get(x,y,z)!==stone||world.get(x+dx,y,z+dz)!==air)continue;
        // The layered shelf is a face decal only; stays within the exposed wall.
        const r=hash(x+dx,z+dz,seed+319),u=.12+r*.16;
        const h=.12+r*.12, inset=.012;
        const cx0=x+.5+dx*(.5+inset),cz0=z+.5+dz*(.5+inset);
        const tx=-dz,tz=dx;
        const left=[cx0-tx*(.27+u),y+.16,cz0-tz*(.27+u)];
        const right=[cx0+tx*(.27+u),y+.16,cz0+tz*(.27+u)];
        const crown=[cx0+tx*(r-.5)*.12,y+.16+h,cz0+tz*(r-.5)*.12];
        const shadow=[.26+r*.07,.31+r*.06,.35+r*.06];
        const highlight=[.60+r*.09,.62+r*.06,.57+r*.06];
        emit(left,right,crown,shadow);
        emit([cx0-tx*u,y+.16+h*.66,cz0-tz*u],[cx0+tx*u,y+.16+h*.66,cz0+tz*u],crown,highlight);
        // One short broken seam creates a recognizable jagged highland stratum.
        const lower=[cx0-tx*.14,y-.13,cz0-tz*.14];
        emit(lower,[cx0+tx*.16,y-.10,cz0+tz*.16],[cx0+tx*.03,y-.04,cz0+tz*.03],shadow);
        // Connected two-level fractured rock band: a broad, irregular shale
        // shoulder with an offset pale mineral lens. Both are face-only and
        // sit below the exposed crown, never crossing a traversable opening.
        const width=.29+r*.13, step=.19+r*.09;
        const a=[cx0-tx*width,y-.30,cz0-tz*width];
        const b=[cx0+tx*(width*.79),y-.26,cz0+tz*(width*.79)];
        const c=[cx0+tx*(r-.5)*.24,y-.30+step,cz0+tz*(r-.5)*.24];
        const deep=[.22+r*.08,.28+r*.06,.32+r*.05];
        emit(a,b,c,deep);
        const pale=[.66+r*.08,.65+r*.07,.55+r*.08];
        const lensA=[cx0-tx*(width*.63),y-.30+step*.58,cz0-tz*(width*.63)];
        const lensB=[cx0+tx*(width*.37),y-.30+step*.65,cz0+tz*(width*.37)];
        emit(lensA,lensB,c,pale);
        // Split lower fracture reads as a continuation, not an isolated stamp.
        const crack=[cx0+tx*(r-.5)*.19,y-.47,cz0+tz*(r-.5)*.19];
        emit(a,c,crack,shadow);
      }
    }
  return new Float32Array(out);
}
