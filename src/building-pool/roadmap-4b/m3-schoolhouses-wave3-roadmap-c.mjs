// Roadmap C 4B Wave3 — original temperate LARGE Collegium; historical M3 148 sources untouched.
import {M3_148_ALL} from './m3-schoolhouses-second5.mjs';
import {buildDistinctive4B} from './m2-distinctive.mjs';
import {validateBlueprint,validateCollection,geometrySignature} from './schema.mjs';
export const ROADMAP_C_4B_WAVE3_PLAN=Object.freeze({
  "t": "schoolhouse",
  "b": "temperate",
  "s": "large",
  "variant": 1,
  "title": "Alderbridge Roundcourt Collegium",
  "dim": [
    64,
    20,
    65
  ],
  "r": [
    [
      26,
      36,
      1,
      62
    ],
    [
      4,
      27,
      8,
      28
    ],
    [
      36,
      59,
      6,
      20
    ],
    [
      3,
      26,
      40,
      61
    ],
    [
      36,
      59,
      42,
      61
    ],
    [
      19,
      42,
      28,
      42
    ]
  ],
  "discs": [
    [
      11,
      31,
      9,
      7
    ],
    [
      50,
      33,
      9,
      8
    ]
  ],
  "e": [
    31,
    1
  ],
  "rooms": [
    [
      "classroom",
      12,
      15
    ],
    [
      "shared-study",
      50,
      13
    ],
    [
      "teacher-area",
      31,
      7
    ],
    [
      "natural-history-laboratory",
      12,
      53
    ],
    [
      "civic-cartography-gallery",
      49,
      51
    ],
    [
      "roundcourt-lecture-room",
      31,
      36
    ]
  ],
  "div": [
    [
      "x",
      36,
      7,
      22,
      13
    ]
  ],
  "peak": [
    [
      12,
      15
    ],
    [
      50,
      13
    ],
    [
      31,
      7
    ],
    [
      13,
      53
    ],
    [
      49,
      51
    ],
    [
      11,
      31
    ],
    [
      50,
      33
    ]
  ],
  "roof": "alderbridge-seven-arched-pavilions-and-observatory-court"
});
export const ROADMAP_C_4B_WAVE3_SCHOOL=Object.freeze((()=>{
 const b=buildDistinctive4B(ROADMAP_C_4B_WAVE3_PLAN);
 const candidate={...b,provenance:{...b.provenance,milestone:'M3-wave3',source:'Roadmap C original seven-pavilion educational roundcourt',method:'literal authored six teaching wings, linked rounded lecture courts, regional source bearing roofs and full two-high circulation'}};
 validateBlueprint(candidate);return Object.freeze(candidate);
})());
export const ROADMAP_C_4B_149_ALL=Object.freeze([...M3_148_ALL,ROADMAP_C_4B_WAVE3_SCHOOL]);
validateCollection(ROADMAP_C_4B_149_ALL);
if(ROADMAP_C_4B_149_ALL.length!==149||new Set(ROADMAP_C_4B_149_ALL.map(geometrySignature)).size!==149)throw Error('Roadmap C 4B new roundcourt school lacks unique source geometry or historical preservation');
