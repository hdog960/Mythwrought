// Render-only geological bedding on genuine exposed highland stone walls.
// Never alters seeded voxels, collision, saves or traversable cave openings.
const fract=n=>n-Math.floor(n);
const hash=(x,z,s)=>fract(Math.sin(x*127.1+z*311.7+s*0.013)*43758.5453);
export function ridgeStrataVertices(world,cx,cz,{chunkSize=16,heightAt,stone=3,air=0,dirt=2,grass=1}={}){
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
        // A second, offset bedding tier ties high cliff faces into a single
        // geological wall instead of leaving isolated floating rock stamps.
        // Sample the actual exposed voxel at each tier: caves and user edits
        // interrupt the band rather than being painted over.
        if(top-adjacent>=7){
          const upperY=y+1;
          if(upperY<=top && world.get(x,upperY,z)===stone &&
             world.get(x+dx,upperY,z+dz)===air){
            const drift=hash(x,z,seed+2207);
            const tierW=.32+drift*.12;
            const tierA=[cx0-tx*tierW,upperY-.28,cz0-tz*tierW];
            const tierB=[cx0+tx*(tierW*.86),upperY-.23,cz0+tz*(tierW*.86)];
            const tierPeak=[cx0+tx*(drift-.5)*.18,upperY-.05,cz0+tz*(drift-.5)*.18];
            emit(tierA,tierB,tierPeak,deep);
            emit([cx0-tx*(tierW*.54),upperY-.20,cz0-tz*(tierW*.54)],
                 [cx0+tx*(tierW*.31),upperY-.18,cz0+tz*(tierW*.31)],
                 tierPeak,pale);
          }
        }
        // Crestward fracture on truly tall, exposed escarpments. Its broken
        // diagonal joins the upper bedding to the next stone level without
        // painting across a mined opening or changing the underlying voxels.
        if(top-adjacent>=9){
          const crestY=y+2;
          if(crestY<=top && world.get(x,crestY,z)===stone &&
             world.get(x+dx,crestY,z+dz)===air){
            const k=hash(x,z,seed+3941);
            const crestWidth=.24+k*.16;
            const base=[cx0-tx*crestWidth,crestY-.39,cz0-tz*crestWidth];
            const tip=[cx0+tx*(k-.5)*.22,crestY-.07,cz0+tz*(k-.5)*.22];
            const edge=[cx0+tx*(crestWidth*.86),crestY-.32,cz0+tz*(crestWidth*.86)];
            emit(base,edge,tip,shadow);
            const split=[cx0+tx*(k-.5)*.12,crestY-.53,cz0+tz*(k-.5)*.12];
            emit(base,tip,split,highlight);
          }
        }
        // Broad foot-of-cliff talus is only painted on genuinely exposed
        // stone above an open approach. It connects the bedding to the
        // valley floor without inventing a passable cave or changing terrain.
        const footY=Math.max(adjacent+1,y-2);
        if(top-adjacent>=5 && footY<y && world.get(x,footY,z)===stone &&
           world.get(x+dx,footY,z+dz)===air){
          const lean=hash(x,z,seed+1273);
          const baseW=.30+lean*.14;
          const baseL=[cx0-tx*baseW,footY+.09,cz0-tz*baseW];
          const baseR=[cx0+tx*(baseW*.82),footY+.07,cz0+tz*(baseW*.82)];
          const apex=[cx0+tx*(lean-.5)*.20,footY+.65+lean*.22,cz0+tz*(lean-.5)*.20];
          const scree=[.32+lean*.09,.37+lean*.08,.38+lean*.06];
          emit(baseL,baseR,apex,scree);
          // Offset secondary slate chip makes each foothill contour less
          // repetitive while remaining inside the same exposed face.
          const chip=[cx0+tx*(.08+lean*.12),footY+.26,cz0+tz*(.08+lean*.12)];
          emit(baseR,chip,apex,highlight);
        }
      }
    }
  // Valley-to-highland transition: short, earthy contour seams appear only
  // where an existing grass-topped slope exposes its natural dirt side.
  // No voxel, seed, biome boundary, collision or save is changed. Sampling
  // world.get makes player-built retaining walls suppress these decals.
  for(let x=cx*chunkSize;x<(cx+1)*chunkSize;x++)
    for(let z=cz*chunkSize;z<(cz+1)*chunkSize;z++){
      const top=heightAt(x,z,seed);
      if(top<6||world.get(x,top,z)!==grass||hash(x,z,seed+6017)>.38)continue;
      for(const [dx,dz] of faces){
        const neighbor=heightAt(x+dx,z+dz,seed);
        if(top-neighbor<2||top-neighbor>5)continue;
        const y=top-1;
        if(world.get(x,y,z)!==dirt||world.get(x+dx,y,z+dz)!==air)continue;
        const r=hash(x+dx*7,z+dz*7,seed+6089);
        const tx=-dz,tz=dx,offset=.513;
        const px=x+.5+dx*offset,pz=z+.5+dz*offset;
        const w=.28+r*.14,drop=.12+r*.10;
        const left=[px-tx*w,y+.68,pz-tz*w];
        const right=[px+tx*w*.85,y+.63,pz+tz*w*.85];
        const low=[px+tx*(r-.5)*.16,y+.68-drop,pz+tz*(r-.5)*.16];
        const soil=[.35+r*.08,.27+r*.05,.19+r*.04];
        const sunlit=[.60+r*.08,.47+r*.07,.30+r*.05];
        emit(left,right,low,soil);
        emit([px-tx*w*.63,y+.69,pz-tz*w*.63],right,
             [px+tx*(r-.5)*.10,y+.69-drop*.48,pz+tz*(r-.5)*.10],sunlit);
      }
    }
  // Broad valley-side terraces: coherent horizontal sediment lines on real
  // exposed dirt, with a low-frequency seed-stable meander across columns.
  // Render-only and edit-aware; no terrain generation or block IDs change.
  for(let x=cx*chunkSize;x<(cx+1)*chunkSize;x++)
    for(let z=cz*chunkSize;z<(cz+1)*chunkSize;z++){
      const top=heightAt(x,z,seed);
      if(top<10||world.get(x,top,z)!==grass)continue;
      for(const [dx,dz] of faces){
        const neighbor=heightAt(x+dx,z+dz,seed);
        if(top-neighbor<3||top-neighbor>7)continue;
        const y=top-2;
        if(world.get(x,y,z)!==dirt||world.get(x+dx,y,z+dz)!==air)continue;
        // Neighboring cells share a continuous bedding height; tiny offsets
        // vary the edge without producing isolated floating ornaments.
        const wave=hash(Math.floor(x/7),Math.floor(z/7),seed+7193);
        const offset=.514,tx=-dz,tz=dx;
        const px=x+.5+dx*offset,pz=z+.5+dz*offset;
        const rise=.40+wave*.12;
        const a=[px-tx*.49,y+rise,pz-tz*.49];
        const b=[px+tx*.49,y+rise+.035,pz+tz*.49];
        const c=[px+tx*.49,y+rise-.095,pz+tz*.49];
        const dark=[.30+wave*.06,.24+wave*.04,.18+wave*.03];
        const light=[.57+wave*.07,.44+wave*.05,.28+wave*.04];
        emit(a,b,c,dark);
        emit(a,c,[px-tx*.49,y+rise-.07,pz-tz*.49],light);
      }
    }
  // Wider valley amphitheatre contours: terraces trace the actual dirt wall
  // at two depths, making steep valleys read as connected landforms at range.
  // Every visible segment is conditioned on an exposed, unedited dirt voxel;
  // no generated block, collision surface or cave opening is introduced.
  for(let x=cx*chunkSize;x<(cx+1)*chunkSize;x++)
    for(let z=cz*chunkSize;z<(cz+1)*chunkSize;z++){
      const top=heightAt(x,z,seed);
      if(top<9||world.get(x,top,z)!==grass)continue;
      for(const [dx,dz] of faces){
        const low=heightAt(x+dx,z+dz,seed);
        if(top-low<4||top-low>8)continue;
        const tx=-dz,tz=dx,px=x+.5+dx*.515,pz=z+.5+dz*.515;
        // Multiple steps follow a shared elevation, so neighboring columns
        // join rather than forming randomly placed individual ornaments.
        for(const depth of [2,3]){
          const y=top-depth;
          if(y<=low||world.get(x,y,z)!==dirt||world.get(x+dx,y,z+dz)!==air)continue;
          const variation=hash(Math.floor(x/9),Math.floor(z/9),seed+8347+depth);
          const rise=.34+variation*.08;
          const a=[px-tx*.49,y+rise,pz-tz*.49];
          const b=[px+tx*.49,y+rise,pz+tz*.49];
          const c=[px+tx*.49,y+rise-.15,pz+tz*.49];
          const d=[px-tx*.49,y+rise-.15,pz-tz*.49];
          const dark=depth===2?[.29,.26,.22]:[.34,.29,.22];
          const light=depth===2?[.59,.47,.32]:[.52,.40,.27];
          emit(a,b,c,dark);
          emit(a,c,d,light);
        }
      }
    }
  return new Float32Array(out);
}
