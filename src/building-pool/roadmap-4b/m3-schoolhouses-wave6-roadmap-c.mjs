// Roadmap C original 4B Wave6: Skyvault mountaintop Academy, ten distinct massing regions and nine connected rooms.
// All prior 151 source blueprint objects kept byte-for-byte from accepted Luminbough PR #260.
import {ROADMAP_C_4B_151_ALL} from './m3-schoolhouses-wave5-roadmap-c.mjs';
import {buildDistinctive4B} from './m2-distinctive.mjs';
import {validateBlueprint,validateCollection,geometrySignature} from './schema.mjs';
export const ROADMAP_C_4B_WAVE6_PLAN=Object.freeze({
  "t": "schoolhouse",
  "b": "mountain",
  "s": "large",
  "variant": 2,
  "title": "Skyvault Terraced Survey Academy",
  "dim": [
    88,
    20,
    83
  ],
  "r": [
    [
      31,
      43,
      1,
      80
    ],
    [
      2,
      33,
      9,
      24
    ],
    [
      40,
      80,
      3,
      18
    ],
    [
      5,
      35,
      43,
      68
    ],
    [
      39,
      85,
      52,
      75
    ],
    [
      10,
      51,
      25,
      40
    ],
    [
      38,
      71,
      34,
      51
    ],
    [
      1,
      22,
      31,
      43
    ],
    [
      66,
      86,
      25,
      39
    ],
    [
      19,
      49,
      70,
      81
    ]
  ],
  "discs": [
    [
      16,
      36,
      10,
      7
    ],
    [
      73,
      42,
      11,
      8
    ],
    [
      30,
      72,
      9,
      7
    ]
  ],
  "holes": [
    [
      16,
      36,
      1,
      1
    ],
    [
      73,
      42,
      1,
      1
    ]
  ],
  "e": [
    36,
    1
  ],
  "rooms": [
    [
      "classroom",
      16,
      16
    ],
    [
      "shared-study",
      69,
      12
    ],
    [
      "teacher-area",
      36,
      8
    ],
    [
      "survey-map-laboratory",
      15,
      57
    ],
    [
      "mountain-rescue-training",
      68,
      62
    ],
    [
      "archive-hall",
      37,
      60
    ],
    [
      "geology-fieldroom",
      72,
      35
    ],
    [
      "engineering-drafting",
      19,
      39
    ],
    [
      "sky-chart-observatory",
      30,
      73
    ]
  ],
  "div": [
    [
      "x",
      31,
      10,
      24,
      15
    ],
    [
      "x",
      43,
      52,
      75,
      61
    ]
  ],
  "peak": [
    [
      16,
      16
    ],
    [
      69,
      12
    ],
    [
      36,
      8
    ],
    [
      15,
      57
    ],
    [
      68,
      62
    ],
    [
      37,
      60
    ],
    [
      72,
      35
    ],
    [
      19,
      39
    ],
    [
      30,
      73
    ]
  ],
  "roof": "skyvault-nine-split-terraces-and-beacon-arches"
});
export const ROADMAP_C_4B_WAVE6_SCHOOL=Object.freeze((()=>{
 const base=buildDistinctive4B(ROADMAP_C_4B_WAVE6_PLAN);
 const result={...base,provenance:{...base.provenance,milestone:'M3-wave6',source:'Roadmap C original mountaintop Skyvault survey nine-room academy',method:'original ten structural masses, three nonrectangular observatory rotundas, two genuine source-carved skylights, nine accessible teaching spaces and two partition portal lintels'}};
 validateBlueprint(result);return Object.freeze(result);
})());
export const ROADMAP_C_4B_WAVE6_SCHOOLS=Object.freeze([ROADMAP_C_4B_WAVE6_SCHOOL]);
export const ROADMAP_C_4B_152_ALL=Object.freeze([...ROADMAP_C_4B_151_ALL,ROADMAP_C_4B_WAVE6_SCHOOL]);
validateCollection(ROADMAP_C_4B_152_ALL);
if(ROADMAP_C_4B_152_ALL.length!==152||new Set(ROADMAP_C_4B_152_ALL.map(geometrySignature)).size!==152)throw Error('Skyvault source duplicate or historical school design mutation');
