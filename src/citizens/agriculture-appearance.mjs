// Agriculture and food outfits. Tool dimensions are local to the hand pivot,
// so each tool follows the same arm animation on all six rigs.
const outfits = {
  farmer: {leather:'#786146', trim:'#ccac65', cut:'bib', headwear:'brim', tool:'hoe'},
  rancher: {leather:'#884b32', trim:'#ce9463', cut:'vest', headwear:'brim', tool:'halter'},
  shepherd: {leather:'#66674f', trim:'#d0bea1', cut:'mantle', headwear:'wrap', tool:'crook'},
  gardener: {leather:'#5a704a', trim:'#c9ba6d', cut:'pockets', headwear:'wrap', tool:'shears'},
  'greenhouse-grower': {leather:'#3d7161', trim:'#a4be7c', cut:'bib', headwear:'visor', tool:'seedling-tray'},
  beekeeper: {leather:'#ad7041', trim:'#e6bf71', cut:'mantle', headwear:'veil', tool:'smoker'},
  hunter: {leather:'#645644', trim:'#a99264', cut:'strap', headwear:'wrap', tool:'bow'},
  fisherman: {leather:'#365c6f', trim:'#91aaa4', cut:'vest', headwear:'brim', tool:'rod'},
  miller: {leather:'#8d795f', trim:'#ddd0ad', cut:'pockets', headwear:'visor', tool:'scoop'},
  baker: {leather:'#8f6347', trim:'#f0cf9b', cut:'apron', headwear:'cap', tool:'peel'},
  butcher: {leather:'#7c4340', trim:'#c1ada0', cut:'apron', headwear:'visor', tool:'cleaver'},
  brewer: {leather:'#5c5244', trim:'#c89358', cut:'strap', headwear:'cap', tool:'pitcher'},
};

const wood = '#9a7149';
const darkWood = '#584139';
const iron = '#85959a';
const brass = '#b28b55';

export function agricultureOutfit(professionId) {
  return Object.hasOwn(outfits,professionId) ? outfits[professionId] : undefined;
}

export function agricultureClothes(outfit, {body,head,width,shoulder,hip,depth,variant}) {
  const {cut,leather,trim,headwear} = outfit;
  const front = depth*.55;
  const middle = (hip+shoulder)*.5;
  if (cut === 'bib' || cut === 'apron') {
    body(0,middle-.025,front,width*.73,shoulder-hip,.052,leather);
    body(variant ? width*.18 : -width*.18,middle-.105,front+.03,width*.17,.084,.022,trim);
    for (const side of [-1,1]) body(side*width*.24,shoulder-.055,front+.023,width*.10,.145,.029,trim);
  } else if (cut === 'vest' || cut === 'pockets') {
    for (const side of [-1,1]) {
      body(side*width*.23,middle,front,width*.28,.27,.053,leather);
      body(side*width*.26,middle-.053,front+.031,width*.17,.084,.026,trim);
    }
  } else if (cut === 'mantle') {
    body(0,shoulder-.031,0,width*1.03,.108,depth+.083,leather);
    body(0,shoulder-.092,front,.082,.083,.055,trim);
  } else {
    for (let step=0;step<5;step++) {
      const x = (step-2)*width*.143*(variant ? -1 : 1);
      body(x,shoulder-.035-step*.067,front,.09,.076,.046,leather);
    }
    body(width*.19,middle-.042,front+.028,.062,.042,.022,trim);
  }

  if (headwear === 'brim' || headwear === 'veil') {
    head(0,.165,0,1.24,.038,1.12,trim);
    head(0,.208,-.04,.78,.064,.75,leather);
    if (headwear === 'veil') {
      for (const side of [-1,1]) head(side*.47,.035,-.02,.08,.21,.77,trim);
      head(0,-.08,.385,.91,.035,.082,trim);
    }
  } else if (headwear === 'cap') {
    head(0,.176,-.025,.82,.091,.81,trim);
    head(0,.236,-.045,.66,.048,.65,leather);
  } else if (headwear === 'visor') {
    head(0,.14,.37,.94,.047,.38,trim);
    head(0,.177,.28,.82,.045,.25,leather);
  } else {
    head(0,.122,0,1.02,.042,.96,trim);
    head(variant ? .47 : -.47,.101,-.24,.13,.098,.19,leather);
  }
}

export function agricultureTool(tool, box) {
  const shaft = (y,height) => box(0,y,.112,.037,height,.044,wood);
  switch (tool) {
    case 'hoe':
      shaft(.06,.33);
      box(.061,.23,.112,.151,.044,.074,iron);
      box(.125,.203,.112,.031,.067,.073,iron);
      break;
    case 'halter':
      box(-.043,.006,.109,.033,.152,.043,darkWood);
      box(.05,.006,.109,.035,.151,.043,darkWood);
      box(.004,.073,.109,.112,.032,.039,wood);
      box(.004,-.07,.109,.11,.024,.045,brass);
      break;
    case 'crook':
      shaft(.096,.42);
      box(.051,.315,.112,.127,.04,.049,wood);
      box(.107,.274,.112,.037,.105,.041,wood);
      break;
    case 'shears':
      box(-.033,.022,.111,.038,.125,.052,darkWood);
      box(.033,.022,.111,.038,.125,.052,darkWood);
      box(-.055,.128,.111,.04,.128,.052,iron);
      box(.051,.132,.111,.04,.138,.052,iron);
      box(0,.075,.144,.05,.041,.018,brass);
      break;
    case 'seedling-tray':
      box(0,.024,.145,.22,.058,.185,darkWood);
      for (const side of [-1,1]) {
        box(side*.048,.076,.145,.038,.085,.04,'#537953');
        box(side*.048,.11,.158,.064,.025,.049,'#88a559');
      }
      break;
    case 'smoker':
      box(0,.039,.146,.112,.159,.105,iron);
      box(.048,.126,.146,.05,.044,.073,brass);
      box(-.063,.034,.146,.062,.125,.085,wood);
      box(0,-.033,.146,.118,.035,.111,brass);
      break;
    case 'bow':
      box(0,.02,.115,.054,.26,.06,darkWood);
      for (const side of [-1,1]) {
        box(.046,.015+side*.178,.115,.06,.102,.053,wood);
        box(.095,.015+side*.224,.115,.063,.044,.04,wood);
      }
      box(.119,.015,.115,.013,.424,.013,'#d6cdab');
      break;
    case 'rod':
      shaft(.111,.44);
      box(.025,.348,.112,.06,.061,.035,wood);
      box(.053,.245,.112,.013,.20,.016,'#d7c5a2');
      box(.053,.146,.112,.024,.037,.022,iron);
      break;
    case 'scoop':
      shaft(.045,.20);
      box(0,.157,.143,.157,.077,.096,wood);
      box(.059,.164,.178,.032,.076,.086,brass);
      box(-.059,.164,.178,.032,.076,.086,brass);
      break;
    case 'peel':
      shaft(.057,.27);
      box(0,.23,.116,.15,.16,.043,wood);
      box(0,.314,.116,.114,.039,.043,wood);
      break;
    case 'cleaver':
      shaft(.032,.158);
      box(.042,.158,.111,.121,.126,.044,iron);
      box(.057,.212,.111,.093,.02,.049,'#bac5bf');
      break;
    case 'pitcher':
      box(0,.036,.141,.116,.156,.108,wood);
      box(0,.121,.141,.124,.031,.114,brass);
      box(.072,.047,.141,.042,.083,.075,darkWood);
      box(-.045,.134,.141,.063,.038,.068,brass);
      break;
  }
}
