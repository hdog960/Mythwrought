export function buildWorkClothes(outfit, {body,head,width,shoulder,hip,depth,variant}) {
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
  } else if (cut === 'lapels') {
    for (const side of [-1,1]) {
      body(side*width*.28,middle,front,width*.31,.35,.054,leather);
      body(side*width*.14,shoulder-.059,front+.027,.055,.118,.031,trim);
    }
    body(0,middle-.103,front+.02,.05,.038,.022,trim);
  } else if (cut === 'sash') {
    body(0,hip+.064,front,width*.9,.115,.057,leather);
    body(variant ? -width*.3 : width*.3,hip-.067,front,.077,.196,.058,leather);
    body(0,hip+.082,front+.033,width*.86,.027,.019,trim);
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
