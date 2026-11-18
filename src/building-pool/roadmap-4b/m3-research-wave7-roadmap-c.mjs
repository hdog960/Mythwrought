// Roadmap C 4B original Wave7: first large desert magical research institute, eight original wing bands, three authentic stone orbit rotundas.
// Original accepted school/healing/library sources remain immutable; theoretical only.
import {ROADMAP_C_4B_152_ALL} from './m3-schoolhouses-wave6-roadmap-c.mjs';
import {buildDistinctive4B} from './m2-distinctive.mjs';
import {validateBlueprint,validateCollection,geometrySignature} from './schema.mjs';
export const ROADMAP_C_4B_WAVE7_PLAN=Object.freeze({
  "t": "magical-research-institute",
  "b": "desert",
  "s": "large",
  "variant": 1,
  "title": "Sunrift Celestial Orrery Research Institute",
  "dim": [
    88,
    20,
    84
  ],
  "r": [
    [
      35,
      49,
      1,
      80
    ],
    [
      4,
      37,
      9,
      25
    ],
    [
      48,
      82,
      7,
      27
    ],
    [
      7,
      37,
      43,
      67
    ],
    [
      46,
      82,
      45,
      70
    ],
    [
      20,
      65,
      27,
      44
    ],
    [
      21,
      65,
      65,
      80
    ],
    [
      13,
      57,
      35,
      53
    ]
  ],
  "discs": [
    [
      15,
      36,
      10,
      8
    ],
    [
      72,
      37,
      11,
      9
    ],
    [
      41,
      73,
      10,
      7
    ]
  ],
  "holes": [
    [
      15,
      36,
      1,
      1
    ],
    [
      72,
      37,
      1,
      1
    ]
  ],
  "e": [
    41,
    1
  ],
  "rooms": [
    [
      "research-hall",
      17,
      17
    ],
    [
      "secure-repository",
      72,
      17
    ],
    [
      "astral-lecture-hall",
      41,
      9
    ],
    [
      "crystal-transmutation-lab",
      17,
      55
    ],
    [
      "desert-geomancy-theater",
      69,
      57
    ],
    [
      "sun-chart-archive",
      41,
      59
    ],
    [
      "starlight-condensary",
      18,
      39
    ],
    [
      "clockwork-sky-gallery",
      69,
      36
    ],
    [
      "upper-orrery-studio",
      41,
      74
    ]
  ],
  "div": [
    [
      "x",
      35,
      10,
      24,
      16
    ],
    [
      "x",
      49,
      46,
      70,
      56
    ]
  ],
  "peak": [
    [
      17,
      17
    ],
    [
      72,
      17
    ],
    [
      41,
      9
    ],
    [
      17,
      55
    ],
    [
      69,
      57
    ],
    [
      41,
      59
    ],
    [
      18,
      39
    ],
    [
      69,
      36
    ],
    [
      41,
      74
    ]
  ],
  "roof": "sunrift-nine-terraces-and-orbiting-astrarium-ridges"
});
export const ROADMAP_C_4B_WAVE7_RESEARCH=Object.freeze((()=>{
 const original=buildDistinctive4B(ROADMAP_C_4B_WAVE7_PLAN);
 const result={...original,provenance:{...original.provenance,milestone:'M3-wave7',source:'Roadmap C original source-authored desert magical research institute',method:'nine original lab/repository spaces, three orbiting rotundas, two true open sky source shafts and two source-bearing dividing portals'}};
 validateBlueprint(result);return Object.freeze(result);
})());
export const ROADMAP_C_4B_WAVE7_INSTITUTES=Object.freeze([ROADMAP_C_4B_WAVE7_RESEARCH]);
export const ROADMAP_C_4B_153_ALL=Object.freeze([...ROADMAP_C_4B_152_ALL,ROADMAP_C_4B_WAVE7_RESEARCH]);
validateCollection(ROADMAP_C_4B_153_ALL);
if(ROADMAP_C_4B_153_ALL.length!==153||new Set(ROADMAP_C_4B_153_ALL.map(geometrySignature)).size!==153)throw Error('Sunrift original source duplicates or changes earlier protected schoolhouse roster');
