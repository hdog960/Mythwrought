const faces = [
  [[1, 5, 6, 2], .75], [[4, 0, 3, 7], .6], [[3, 2, 6, 7], 1],
  [[4, 5, 1, 0], .48], [[5, 4, 7, 6], .91], [[0, 1, 2, 3], .7]
];

const palette = hex => [0, 2, 4].map(offset => parseInt(hex.slice(offset, offset + 2), 16) / 255);

function model(build) {
  const data = [];
  const box = (x, y, z, w, h, d, tint, joint = 0, tilt = 0, taper = 1) => {
    const color = palette(tint);
    const corners = [[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],
      [-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]].map(([dx, dy, dz]) => {
      const scale = dy > 0 ? taper : 1;
      const a = dx * w * scale * .5, b = dy * h * .5;
      return [x + a * Math.cos(tilt) - b * Math.sin(tilt),
        y + a * Math.sin(tilt) + b * Math.cos(tilt), z + dz * d * scale * .5];
    });
    for (const [indices, light] of faces)
      for (const i of [0, 1, 2, 0, 2, 3])
        data.push(...corners[indices[i]], ...color.map(channel => channel * light), joint);
  };
  build(box);
  return new Float32Array(data);
}

export const meshes = Object.freeze({
  deer: model(box => {
    box(0,.88,-.11,.56,.51,1.12,'ac6b3c',0,0,.77);
    box(0,.70,-.06,.44,.19,.79,'ead3a8');
    box(0,1.11,.34,.27,.57,.37,'bd7948',0,0,.78);
    box(0,1.38,.52,.36,.32,.55,'af6e40',0,0,.8);
    box(0,1.304,.775,.26,.17,.16,'60443c');
    for (const side of [-1,1]) {
      box(side*.173,1.43,.64,.044,.064,.077,'30252a');
      box(side*.22,1.57,.43,.12,.26,.16,'b97c49',0,side*-.55,.5);
      box(side*.17,1.74,.43,.047,.40,.052,'dac6a0',0,side*-.25);
      box(side*.255,1.82,.44,.044,.22,.049,'e1cfab',0,side*-.68);
      for (const front of [-1,1]) {
        const x = side*.185, z = front*.295-.09, joint = front*side;
        box(x,.37,z,.105,.72,.115,'985d37',joint,0,.8);
        box(x,.065,z,.12,.13,.15,'50403b',joint,0,.94);
      }
    }
    box(0,.94,-.72,.22,.19,.32,'e8d6ac',2,0,.55);
  }),
  goblin: model(box => {
    box(0,.72,0,.52,.57,.34,'483d62',0,0,.87);
    box(0,.50,.02,.55,.12,.37,'685444');
    box(.07,.50,.22,.13,.105,.067,'d1aa64');
    box(0,1.1,.065,.45,.37,.44,'718d4e',0,0,.8);
    box(0,1.04,.302,.15,.115,.135,'8e9f5c',0,0,.56);
    box(0,1.255,.03,.49,.13,.45,'514465',0,0,.79);
    for (const side of [-1,1]) {
      box(side*.304,1.15,.035,.18,.115,.19,'819957',0,side*.42,.6);
      box(side*.12,1.12,.276,.081,.045,.028,'f4ca7b');
      box(side*.15,.24,.01,.17,.40,.19,'51495d',side);
      box(side*.15,.075,.075,.19,.15,.31,'594436',side);
      box(side*.335,.70,.025,.16,.41,.16,'778f51',-side,side*.24,.86);
      box(side*.37,.49,.055,.16,.14,.17,'657448',-side);
    }
  }),
  glownewt: model(box => {
    box(0,.20,-.10,.36,.27,.73,'359e94',0,0,.78);
    box(0,.38,.22,.47,.24,.39,'39c5a5',0,0,.82);
    box(0,.290,.39,.33,.12,.19,'77e6cc',0,0,.85);
    for (const side of [-1,1]) {
      box(side*.169,.423,.344,.112,.074,.084,'153e55');
      box(side*.171,.444,.381,.04,.04,.021,'b5f1b2');
      box(side*.255,.38,.13,.14,.061,.21,'ee8fc5',0,side*.28,.72);
      box(side*.213,.09,.12,.20,.08,.11,'4dbeb0',side);
      box(side*.194,.09,-.30,.20,.08,.11,'4dbeb0',-side);
      box(side*.115,.345,-.19,.045,.064,.086,'e5e987');
    }
    box(0,.18,-.52,.155,.14,.34,'42baa8',2,0,.57);
    box(0,.23,-.74,.095,.14,.23,'81ead4',2,0,.53);
    box(0,.30,-.86,.046,.12,.095,'f0f2a0',2,0,.45);
  }),
  target: model(box => {
    box(0,.36,0,.31,.62,.24,'6d87b6',0,0,.82);
    box(0,.83,.03,.30,.33,.27,'a2aed3',0,0,.79);
    box(0,.69,.14,.24,.09,.09,'ebc174');
  })
});
