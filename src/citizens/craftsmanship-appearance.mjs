const wood = '#906140';
const steel = '#84949c';
const darkIron = '#59656a';
const brass = '#c09b65';

const outfits = {
  miner: {
    leather:'#524846', trim:'#b99a70', cut:'bib', headwear:'cap',
    equipment:[
      [0,.091,.110,.041,.34,.046,wood],
      [-.002,.26,.110,.19,.041,.056,steel],
      [-.091,.237,.110,.034,.064,.049,darkIron],
      [.087,.236,.110,.042,.066,.055,steel],
    ],
  },
  prospector: {
    leather:'#755b3c', trim:'#d2ad68', cut:'pockets', headwear:'brim',
    equipment:[
      [0,.044,.110,.038,.171,.049,wood],
      [0,.145,.118,.116,.103,.051,brass],
      [0,.145,.148,.071,.064,.023,'#73a9a3'],
    ],
  },
  'quarry-worker': {
    leather:'#665957', trim:'#a8a594', cut:'mantle', headwear:'wrap',
    equipment:[
      [0,.077,.107,.048,.351,.052,wood],
      [0,.255,.107,.191,.105,.11,darkIron],
      [-.091,.254,.107,.028,.101,.113,steel],
    ],
  },
  lumberjack: {
    leather:'#855044', trim:'#bb9b65', cut:'vest', headwear:'wrap',
    equipment:[
      [0,.079,.109,.047,.319,.051,wood],
      [.059,.219,.110,.14,.105,.054,darkIron],
      [.119,.218,.110,.046,.145,.044,steel],
    ],
  },
  forester: {
    leather:'#4f6744', trim:'#b1ac76', cut:'strap', headwear:'brim',
    equipment:[
      [0,.035,.107,.042,.23,.048,wood],
      [0,.16,.107,.13,.043,.046,steel],
      [-.048,.22,.107,.027,.106,.039,darkIron],
      [.048,.22,.107,.027,.106,.039,darkIron],
      [0,.23,.107,.03,.124,.04,steel],
    ],
  },
  blacksmith: {
    leather:'#633c31', trim:'#b77f50', cut:'apron', headwear:'wrap',
    equipment:[
      [0,.055,.101,.045,.285,.046,wood],
      [0,.207,.101,.16,.096,.085,darkIron],
      [.074,.207,.101,.03,.092,.088,steel],
    ],
  },
  armorer: {
    leather:'#536472', trim:'#ae9d78', cut:'mantle', headwear:'visor',
    equipment:[
      [0,.003,.124,.17,.177,.065,darkIron],
      [0,.069,.147,.154,.059,.047,steel],
      [-.065,.007,.158,.021,.132,.022,brass],
      [.065,.007,.158,.021,.132,.022,brass],
    ],
  },
  carpenter: {
    leather:'#75503f', trim:'#cfac71', cut:'pockets', headwear:'visor',
    equipment:[
      [0,.018,.148,.191,.068,.124,wood],
      [-.036,.062,.147,.067,.064,.063,'#533d36'],
      [.039,.052,.15,.043,.06,.085,steel],
      [0,-.017,.148,.19,.015,.127,brass],
    ],
  },
  stonemason: {
    leather:'#625864', trim:'#b4a496', cut:'bib', headwear:'cap',
    equipment:[
      [0,.046,.108,.063,.169,.049,'#52626a'],
      [0,.142,.108,.047,.071,.051,steel],
      [0,.192,.109,.025,.054,.049,'#c8c8bb'],
      [0,-.041,.11,.077,.04,.059,wood],
    ],
  },
  potter: {
    leather:'#9a634b', trim:'#deb082', cut:'apron', headwear:'wrap',
    equipment:[
      [0,.01,.143,.13,.079,.127,'#a65f4f'],
      [0,.059,.143,.159,.055,.151,'#ba795a'],
      [0,.097,.143,.093,.029,.096,'#975d4a'],
      [0,.111,.143,.104,.016,.106,'#d5a182'],
    ],
  },
  glassmaker: {
    leather:'#507274', trim:'#b5c7ab', cut:'apron', headwear:'visor',
    equipment:[
      [-.034,.068,.115,.038,.268,.037,steel],
      [.034,.068,.115,.038,.268,.037,darkIron],
      [0,-.071,.115,.106,.041,.051,wood],
      [0,.222,.115,.083,.098,.082,'#71afaf'],
      [0,.279,.115,.053,.035,.054,'#a6d5c6'],
    ],
  },
  tailor: {
    leather:'#754d68', trim:'#d2ad87', cut:'vest', headwear:'wrap',
    equipment:[
      [0,.022,.145,.095,.127,.09,'#9a6385'],
      [0,-.048,.145,.131,.029,.113,wood],
      [0,.091,.145,.131,.03,.116,wood],
      [.058,.12,.125,.026,.137,.024,steel],
    ],
  },
  jeweler: {
    leather:'#456564', trim:'#deb26d', cut:'strap', headwear:'visor',
    equipment:[
      [0,.024,.137,.12,.119,.089,'#473e6f'],
      [0,.079,.157,.121,.028,.101,brass],
      [-.031,.101,.159,.036,.031,.039,'#97b18a'],
      [.028,.107,.158,.043,.041,.043,'#75a9b9'],
    ],
  },
};

export function craftsmanshipOutfit(professionId) {
  return Object.hasOwn(outfits,professionId) ? outfits[professionId] : undefined;
}
