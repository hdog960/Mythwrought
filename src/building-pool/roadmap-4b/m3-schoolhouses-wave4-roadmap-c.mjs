// Roadmap C 4B M3 Wave4: original snow large eight-studio academy, separate from 149 protected sources.
import {ROADMAP_C_4B_149_ALL} from './m3-schoolhouses-wave3-roadmap-c.mjs';
import {buildDistinctive4B} from './m2-distinctive.mjs';
import {validateBlueprint,validateCollection,geometrySignature} from './schema.mjs';
export const ROADMAP_C_4B_WAVE4_PLAN=Object.freeze({
  "t": "schoolhouse",
  "b": "snow",
  "s": "large",
  "variant": 1,
  "title": "Northglass Avalanche Observatory Academy",
  "dim": [
    70,
    20,
    72
  ],
  "r": [
    [
      30,
      39,
      1,
      68
    ],
    [
      4,
      31,
      7,
      26
    ],
    [
      38,
      63,
      6,
      23
    ],
    [
      7,
      31,
      43,
      65
    ],
    [
      38,
      63,
      44,
      65
    ],
    [
      15,
      54,
      29,
      39
    ],
    [
      26,
      45,
      14,
      20
    ]
  ],
  "discs": [
    [
      12,
      34,
      9,
      7
    ],
    [
      56,
      34,
      8,
      7
    ]
  ],
  "e": [
    34,
    1
  ],
  "rooms": [
    [
      "classroom",
      14,
      17
    ],
    [
      "shared-study",
      53,
      15
    ],
    [
      "teacher-area",
      34,
      8
    ],
    [
      "avalanche-engineering-lab",
      15,
      55
    ],
    [
      "mountain-rescue-infirmary",
      53,
      55
    ],
    [
      "tundra-library",
      34,
      51
    ],
    [
      "weather-observatory",
      56,
      34
    ],
    [
      "sheltered-seminar",
      12,
      34
    ]
  ],
  "div": [
    [
      "x",
      30,
      8,
      25,
      16
    ],
    [
      "x",
      39,
      44,
      63,
      55
    ]
  ],
  "peak": [
    [
      14,
      17
    ],
    [
      53,
      15
    ],
    [
      34,
      8
    ],
    [
      15,
      55
    ],
    [
      53,
      55
    ],
    [
      34,
      51
    ],
    [
      12,
      34
    ],
    [
      56,
      34
    ]
  ],
  "roof": "northglass-eight-naves-two-glazed-study-domes-and-snow-shed-gables"
});
export const ROADMAP_C_4B_WAVE4_SCHOOL=Object.freeze((()=>{
 const base=buildDistinctive4B(ROADMAP_C_4B_WAVE4_PLAN);
 const result={...base,provenance:{...base.provenance,milestone:'M3-wave4',source:'Roadmap C original winter survival eight-studio academy',method:'literal eight educational rooms, two real partition portals, two circular observation pavilions, snow shed source roof masses'}};
 validateBlueprint(result);return Object.freeze(result);
})());
export const ROADMAP_C_4B_WAVE4_SCHOOLS=Object.freeze([ROADMAP_C_4B_WAVE4_SCHOOL]);
export const ROADMAP_C_4B_150_ALL=Object.freeze([...ROADMAP_C_4B_149_ALL,ROADMAP_C_4B_WAVE4_SCHOOL]);
validateCollection(ROADMAP_C_4B_150_ALL);
if(ROADMAP_C_4B_150_ALL.length!==150||new Set(ROADMAP_C_4B_150_ALL.map(geometrySignature)).size!==150)throw Error('Northglass duplicate or missing protected original school source');
