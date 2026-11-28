import { candidateFamilies } from '../nonblock/candidate-families.mjs';

export const FROST_BERRY_SCENE = 'frostbound:s3:frost-berry';

const family = Object.freeze({
  lane: '48',
  palette: [[.29,.22,.17],[.23,.42,.33],[.59,.75,.70],[.51,.09,.14],[.83,.23,.30]],
  mesh({ seed, anchor: [x,,z], variant }) {
    const positions = [], materials = [];
    const tri = (a,b,c,material) => { positions.push(...a,...b,...c); materials.push(material); };
    function stem(base, tip, radius, material) {
      const corners = [[-1,-1],[-1,1],[1,1],[1,-1]];
      const lower = corners.map(([a,b]) => [base[0]+a*radius,base[1],base[2]+b*radius]);
      const upper = corners.map(([a,b]) => [tip[0]+a*radius*.5,tip[1],tip[2]+b*radius*.5]);
      for (let i=0;i<4;i++) {
        const j=(i+1)%4;
        tri(lower[i],lower[j],upper[j],material);
        tri(lower[i],upper[j],upper[i],material);
      }
    }
    function berry(cx,cy,cz,radius) {
      const ring = [[cx+radius,cy,cz],[cx,cy,cz+radius],[cx-radius,cy,cz],[cx,cy,cz-radius]];
      for (let i=0;i<4;i++) {
        const j=(i+1)%4;
        tri([cx,cy+radius,cz],ring[j],ring[i],4);
        tri([cx,cy-radius,cz],ring[i],ring[j],3);
      }
    }
    const turn = ((Math.imul(x,29)^Math.imul(z,53)^seed)>>>0)%360*Math.PI/180;
    stem([0,0,0],[0,.27,0],.028,0);
    for (let i=0;i<4;i++) {
      const angle=turn+i*Math.PI/2, dx=Math.cos(angle), dz=Math.sin(angle);
      const length=.16+(i%2)*.035+variant*.015, height=.18+(i%3)*.045;
      const bx=dx*length, bz=dz*length;
      stem([0,.07+i*.025,0],[bx,height,bz],.013,1);
      for (const side of [-1,1]) {
        const base=[bx*.58,height-.037,bz*.58], tip=[bx-dz*.09*side,height+.015,bz+dx*.09*side];
        const center=[(base[0]+tip[0])/2,height-.002,(base[2]+tip[2])/2];
        tri(base,[center[0]+dx*.029,center[1],center[2]+dz*.029],tip,1);
        tri(base,tip,[center[0]-dx*.029,center[1],center[2]-dz*.029],2);
      }
      berry(bx,height-.028,bz,.031);
      berry(bx-dz*.046,height-.012,bz+dx*.046,.027);
    }
    return { positions: Float32Array.from(positions), materials: Uint8Array.from(materials), triangleCount: materials.length };
  },
});

// Called by the isolated Frostbound candidate. The shared scenery source
// never imports this family or adds it to an ordinary world's habitat list.
export function registerFrostBerryCandidate() {
  const current = candidateFamilies.get(FROST_BERRY_SCENE);
  if (current === family) return;
  if (current) throw Error('Frostbound frost berry scenery identity is already reserved');
  candidateFamilies.set(FROST_BERRY_SCENE, family);
}
