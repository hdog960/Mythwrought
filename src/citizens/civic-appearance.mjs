const brass = '#c69a51';
const wood = '#8b6041';
const iron = '#8b989c';
const paper = '#dfc699';

const outfit = (leather,trim,cut,headwear,equipment) => ({leather,trim,cut,headwear,equipment});
const ledger = (cover,width,height,depth) => [
  [0,.036,.114,width,height,depth,cover],
  [0,.036,.129,width*.83,height*.85,depth*.86,paper],
  [-width*.47,.036,.115,.021,height*1.04,depth*1.08,brass],
];
const pouch = (color,width,height) => [
  [0,.019,.124,width,height,.094,color],
  [0,height*.6,.125,width*.54,.037,.081,brass],
];
const vessel = (body,rim,width,height) => [
  [0,.025,.145,width,height,.108,body],
  [0,.025+height*.51,.145,width*1.13,.025,.117,rim],
  [width*.63,.035,.145,.034,height*.68,.073,rim],
];
const handle = (height,color=wood) => [0,height*.19,.108,.039,height,.046,color];

const outfits = {
  'general-merchant':outfit('#96573c','#d4ac63','lapels','cap',ledger('#88553d',.166,.195,.069)),
  'market-vendor':outfit('#46736d','#e0b883','pockets','brim',[
    [0,.015,.148,.22,.096,.159,wood],
    [0,.062,.148,.228,.027,.167,brass],
    [-.045,.085,.148,.065,.04,.064,'#ad784c'],
    [.05,.08,.15,.075,.043,.061,'#76874c'],
  ]),
  'caravan-trader':outfit('#7f593d','#c99a63','strap','veil',[
    ...pouch('#a2774a',.162,.186),
    [-.074,.015,.141,.042,.153,.078,'#77553d'],
    [0,.02,.179,.069,.097,.022,'#6e5944'],
  ]),
  banker:outfit('#485d5a','#c5a87c','lapels','cap',[
    [0,.044,.126,.174,.125,.095,'#625047'],
    [0,.105,.127,.183,.031,.101,wood],
    [0,.049,.18,.044,.038,.029,brass],
  ]),
  moneychanger:outfit('#5a5677','#d4ab68','sash','visor',[
    [0,.011,.119,.032,.183,.037,wood],
    [0,.104,.119,.187,.027,.045,brass],
    [-.069,.055,.119,.055,.027,.082,iron],
    [.069,.058,.119,.055,.036,.082,brass],
  ]),
  innkeeper:outfit('#85554d','#d0b790','vest','wrap',[
    [0,.017,.118,.074,.082,.039,brass],
    [0,.114,.118,.035,.147,.041,brass],
    [.033,.161,.118,.065,.032,.041,brass],
    [.026,.126,.118,.052,.025,.039,brass],
  ]),
  'tavern-keeper':outfit('#795148','#ddae70','apron','wrap',vessel('#9c6c42',brass,.125,.143)),
  cook:outfit('#7e6555','#efcf90','bib','cap',[
    handle(.195),
    [0,.129,.13,.141,.073,.141,'#4c5859'],
    [0,.156,.13,.151,.021,.15,iron],
  ]),
  stablekeeper:outfit('#92623c','#c1a469','strap','brim',[
    [-.046,.025,.112,.042,.142,.062,'#76604a'],
    [.046,.025,.112,.042,.142,.062,'#76604a'],
    [0,.095,.112,.123,.045,.059,iron],
    [.06,.106,.112,.047,.046,.045,brass],
  ]),
  'pet-shopkeeper':outfit('#5e7760','#d5b38a','pockets','visor',[
    [0,.027,.152,.149,.128,.13,wood],
    [0,.086,.153,.171,.035,.143,'#8ca098'],
    [0,.025,.225,.065,.055,.025,brass],
  ]),
  'bathhouse-attendant':outfit('#5c7b7e','#d7d4b8','mantle','wrap',[
    [0,.022,.128,.14,.117,.103,'#aab4a5'],
    [0,.067,.158,.15,.051,.057,'#d8caad'],
    [.045,.022,.182,.045,.078,.022,'#94a597'],
  ]),
  mayor:outfit('#794757','#e1b95f','sash','cap',[
    handle(.19,'#684b3d'),
    [0,.201,.111,.117,.072,.068,brass],
    [0,.243,.111,.047,.035,.05,'#d0c298'],
  ]),
  councilor:outfit('#515f7e','#b1a1a5','lapels','wrap',ledger('#706283',.149,.164,.075)),
  clerk:outfit('#705744','#cbb28e','vest','visor',[
    ...ledger('#52443a',.126,.17,.046),
    [.064,.121,.145,.024,.111,.027,'#dbd3af'],
  ]),
  treasurer:outfit('#4f6355','#c6a96a','lapels','brim',pouch('#8b7955',.144,.13)),
  judge:outfit('#514659','#bdb3a9','mantle','cap',[
    handle(.16,'#5b4536'),
    [0,.116,.108,.115,.067,.073,wood],
    [-.045,.116,.108,.033,.077,.079,brass],
  ]),
  diplomat:outfit('#47747a','#dcc18f','sash','visor',[
    [0,.027,.119,.086,.191,.081,'#842f45'],
    [0,.114,.119,.103,.026,.1,brass],
    [0,-.06,.119,.103,.023,.099,brass],
  ]),
  guildmaster:outfit('#874d46','#d6ad65','lapels','wrap',[
    [0,.022,.142,.143,.147,.06,wood],
    [0,.034,.179,.092,.091,.026,brass],
    [0,.034,.193,.046,.044,.024,'#527c78'],
  ]),
  'town-planner':outfit('#526f6b','#ceaf78','strap','visor',[
    [0,.025,.157,.19,.136,.045,paper],
    [0,.064,.185,.127,.02,.017,'#72918c'],
    [.046,.018,.185,.022,.074,.017,'#72918c'],
    [-.075,.029,.179,.026,.151,.025,wood],
  ]),
  messenger:outfit('#675882','#d2a16d','strap','brim',[
    [0,.031,.129,.071,.228,.07,paper],
    [0,.018,.131,.083,.036,.081,'#a75c4a'],
    [0,.018,.18,.033,.032,.029,brass],
  ]),
};

export function civicOutfit(professionId) {
  return Object.hasOwn(outfits,professionId) ? outfits[professionId] : undefined;
}
