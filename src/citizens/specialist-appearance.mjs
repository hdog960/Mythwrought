const steel = '#93a4a8';
const iron = '#576772';
const wood = '#8b6243';
const brass = '#c8aa64';
const linen = '#decbad';

const outfit = (leather,trim,cut,headwear,...equipment) => ({leather,trim,cut,headwear,equipment});
const shaft = (height, color=wood) => [0,height*.16,.11,.039,height,.046,color];
const blade = (center,height,width,color=steel) => [0,center,.11,width,height,.043,color];
const grip = (width, color=brass) => [0,.097,.11,width,.034,.056,color];
const volume = (cover,width,height) => [
  [0,.031,.126,width,height,.084,cover],
  [0,.031,.175,width*.78,height*.82,.023,linen],
  [-width*.47,.031,.128,.021,height*1.031,.09,brass],
];
const vial = (liquid,width,height) => [
  [0,.025,.137,width,height,.091,liquid],
  [0,.024+height*.60,.137,width*.55,.04,.051,'#bad2bc'],
  [0,.05+height*.60,.137,width*.60,.031,.057,wood],
];
const tube = (body,width,height) => [
  [0,.055,.133,width,height,.105,body],
  [0,.047+height*.53,.133,width*1.22,.05,.13,brass],
];

const outfits = {
  guard:outfit('#575c6a','#b4a783','mantle','visor',
    shaft(.18),grip(.127),blade(.253,.282,.076),blade(.399,.035,.038)),
  watchman:outfit('#465d62','#c8ac6d','strap','cap',
    shaft(.189),[0,.16,.134,.134,.108,.117,iron],
    [0,.159,.199,.085,.061,.02,'#d4af63'],[0,.236,.131,.051,.051,.048,brass]),
  soldier:outfit('#626c7d','#bbae8a','lapels','visor',
    shaft(.16,'#6e4d44'),grip(.166),blade(.266,.30,.095),blade(.428,.054,.05)),
  ranger:outfit('#536d55','#a9aa7c','strap','wrap',
    shaft(.22),[.058,.225,.11,.072,.105,.051,wood],
    [.058,-.108,.11,.069,.101,.05,wood],[.102,.054,.11,.015,.35,.017,linen]),
  scout:outfit('#69594c','#be9a74','pockets','brim',
    ...tube('#6b737e',.074,.24),[0,-.091,.133,.068,.047,.104,iron]),
  gatekeeper:outfit('#765652','#c9af7c','mantle','cap',
    shaft(.45,'#6c5041'),blade(.345,.142,.092),[.049,.36,.11,.095,.072,.042,iron]),
  'animal-handler':outfit('#796443','#c4ad75','vest','wrap',
    [-.046,.03,.141,.043,.143,.063,wood],[.045,.029,.141,.046,.142,.063,wood],
    [0,.107,.141,.113,.035,.072,brass],[0,-.043,.141,.128,.041,.082,wood]),
  dockworker:outfit('#4e625d','#b6ab81','bib','brim',
    shaft(.215),[0,.164,.111,.094,.044,.064,steel],[.04,.203,.111,.037,.091,.061,iron]),
  sailor:outfit('#465e79','#e0c8a0','sash','brim',
    [0,.021,.142,.153,.141,.109,'#b1976d'],[0,.061,.203,.117,.035,.028,'#d0bb92'],
    [0,-.028,.195,.13,.032,.036,'#92785a']),
  'lighthouse-keeper':outfit('#5e6475','#cda86b','mantle','brim',
    shaft(.16,'#635a4d'),[0,.145,.147,.132,.135,.129,brass],
    [0,.147,.219,.081,.085,.024,'#e6c875'],[0,.22,.147,.107,.043,.109,iron]),

  healer:outfit('#7d8a68','#eadbb6','lapels','wrap',
    [0,.022,.142,.162,.132,.101,'#9b8f76'],[0,.068,.202,.112,.043,.024,linen],
    [0,.022,.202,.039,.098,.024,linen]),
  apothecary:outfit('#596c76','#d0bd93','apron','visor',...vial('#66886c',.122,.15)),
  herbalist:outfit('#647b54','#c7c085','pockets','brim',
    [0,.001,.142,.13,.078,.088,'#907352'],[-.035,.074,.144,.048,.122,.07,'#778f52'],
    [.035,.083,.146,.056,.14,.064,'#a4ae65']),
  teacher:outfit('#6e6c5c','#d1b58a','lapels','cap',
    shaft(.254),[0,.193,.11,.045,.072,.043,linen]),
  librarian:outfit('#816756','#cabb97','vest','visor',...volume('#76514a',.157,.181)),
  archivist:outfit('#5c6870','#bcaa8c','strap','wrap',
    [0,.024,.129,.175,.152,.081,iron],[0,.021,.181,.111,.024,.032,brass],
    [0,.083,.136,.18,.027,.089,linen]),
  scholar:outfit('#6b637f','#c1b28b','mantle','cap',
    ...volume('#5b4b7b',.147,.196),[.071,.096,.161,.019,.109,.026,linen]),
  astronomer:outfit('#556078','#c9bd82','sash','brim',
    ...tube('#686382',.086,.237),[0,-.081,.134,.06,.029,.088,iron]),
  cartographer:outfit('#817455','#d2bb8d','pockets','brim',
    [0,.014,.137,.18,.138,.043,linen],[0,.071,.14,.197,.027,.054,wood],
    [-.056,.021,.164,.031,.088,.026,'#789c87']),

  mage:outfit('#6e527b','#d0a776','mantle','brim',
    shaft(.38,'#6d4e53'),[0,.317,.11,.117,.102,.092,'#9a82af'],
    [0,.371,.11,.065,.058,.06,'#c6add2']),
  alchemist:outfit('#76644c','#d2b885','bib','wrap',
    [0,.019,.14,.161,.071,.139,'#87765c'],[0,.061,.141,.17,.031,.144,brass],
    [.052,.065,.155,.064,.1,.05,'#697d73']),
  'potion-maker':outfit('#514c79','#c9b499','pockets','cap',...vial('#a277a5',.093,.185)),
  enchanter:outfit('#795b71','#dfb47a','sash','visor',
    ...volume('#725565',.151,.169),[0,.041,.191,.061,.072,.024,brass]),
  'arcane-researcher':outfit('#4e627b','#b3b5a0','lapels','cap',
    [0,.023,.149,.139,.139,.057,'#626399'],[0,.028,.187,.078,.081,.025,'#8ea9b3'],
    [-.055,.099,.151,.036,.034,.038,brass]),
  'crystal-attuner':outfit('#4e7777','#b8c2a3','strap','wrap',
    shaft(.174),[0,.176,.122,.101,.113,.087,'#70aaa1'],
    [0,.242,.122,.063,.049,.058,'#9ec6ae'],[0,.282,.122,.028,.031,.029,'#acd2be']),
  'arcane-teacher':outfit('#745c81','#c6a87f','vest','visor',
    shaft(.207,'#836951'),[0,.185,.11,.067,.036,.073,'#aa8fb3']),
  'magical-creature-keeper':outfit('#526758','#cab58a','pockets','brim',
    [0,.03,.142,.145,.102,.122,'#90735b'],[0,.092,.142,.08,.024,.095,brass],
    [-.046,.045,.206,.032,.042,.025,'#83a49c'],[.046,.045,.206,.032,.042,.025,'#83a49c']),

  actor:outfit('#855e63','#d6a87c','sash','cap',
    [0,.035,.126,.147,.146,.057,'#cabb9b'],[-.04,.057,.16,.035,.032,.021,'#775767'],
    [.04,.057,.16,.035,.032,.021,'#775767'],[0,-.023,.161,.066,.024,.02,'#775767']),
  musician:outfit('#756480','#d5a771','lapels','cap',
    [0,.02,.134,.153,.114,.088,'#9e6f45'],[0,.111,.134,.046,.165,.047,wood],
    [0,.078,.186,.018,.133,.018,linen]),
  'temple-keeper':outfit('#7c7661','#ddc9a3','mantle','wrap',
    [0,.008,.14,.117,.047,.103,brass],[0,.079,.14,.052,.117,.052,linen],
    [0,.149,.14,.021,.032,.021,'#dda866']),
  priest:outfit('#676b82','#ccbb8f','sash','veil',
    ...volume('#60516d',.135,.174),[0,.024,.193,.035,.088,.018,brass]),
  artist:outfit('#536d63','#d1a57a','apron','brim',
    [0,.02,.151,.155,.142,.051,wood],[-.045,.071,.183,.037,.03,.018,'#a75f5a'],
    [.029,.058,.184,.04,.035,.019,'#81a470'],[.043,-.027,.184,.037,.032,.019,'#82a9ac']),
  builder:outfit('#6f594e','#d4ae77','bib','cap',
    shaft(.216),[0,.173,.11,.126,.067,.075,iron],[.068,.171,.11,.027,.061,.074,steel]),
  architect:outfit('#5b6c74','#c7af83','lapels','visor',
    [0,.023,.137,.161,.145,.054,linen],[.035,.047,.176,.092,.023,.02,'#819a9e'],
    [0,-.024,.176,.077,.022,.019,'#819a9e'],[-.062,.017,.177,.021,.112,.022,wood]),
  engineer:outfit('#6b6260','#bba77b','pockets','visor',
    shaft(.189,iron),[0,.151,.11,.104,.041,.055,steel],
    [-.046,.187,.11,.03,.076,.044,steel],[.046,.187,.11,.03,.076,.044,steel]),
  shipwright:outfit('#6b5749','#bda277','vest','brim',
    [0,.018,.144,.176,.071,.093,wood],[.02,.067,.146,.135,.034,.079,'#b78452'],
    [.048,.09,.146,.076,.027,.069,brass]),
  'resonance-technician':outfit('#455f73','#aebca7','strap','visor',
    [0,.024,.143,.127,.13,.092,iron],[0,.041,.2,.079,.077,.029,'#78a9aa'],
    [0,.111,.142,.035,.048,.032,brass]),
};

export function specialistOutfit(professionId) {
  return Object.hasOwn(outfits,professionId) ? outfits[professionId] : undefined;
}
