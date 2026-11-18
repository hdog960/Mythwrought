// Roadmap C Builder 4B Wave5: new original enchanted-forest large conservatory with two real moonwells.
// Reuses all previously source-accepted 150 blueprints by immutable reference, no live integration.
import {ROADMAP_C_4B_150_ALL} from './m3-schoolhouses-wave4-roadmap-c.mjs';
import {buildDistinctive4B} from './m2-distinctive.mjs';
import {validateBlueprint,validateCollection,geometrySignature} from './schema.mjs';
export const ROADMAP_C_4B_WAVE5_PLAN=Object.freeze({
  "t": "schoolhouse",
  "b": "enchanted-forest",
  "s": "large",
  "variant": 2,
  "title": "Luminbough Conservatory of Arcane Cartography",
  "dim": [
    74,
    20,
    76
  ],
  "r": [
    [
      33,
      42,
      1,
      72
    ],
    [
      3,
      35,
      11,
      29
    ],
    [
      41,
      70,
      9,
      31
    ],
    [
      8,
      36,
      45,
      72
    ],
    [
      41,
      70,
      44,
      69
    ],
    [
      23,
      53,
      29,
      46
    ],
    [
      4,
      21,
      31,
      40
    ],
    [
      58,
      72,
      32,
      41
    ]
  ],
  "discs": [
    [
      13,
      35,
      9,
      8
    ],
    [
      61,
      37,
      10,
      9
    ]
  ],
  "holes": [
    [
      15,
      35,
      1,
      1
    ],
    [
      61,
      37,
      1,
      1
    ]
  ],
  "e": [
    37,
    1
  ],
  "rooms": [
    [
      "classroom",
      16,
      19
    ],
    [
      "shared-study",
      58,
      19
    ],
    [
      "teacher-area",
      37,
      8
    ],
    [
      "arcanist-library",
      15,
      57
    ],
    [
      "moonstone-observatory",
      59,
      59
    ],
    [
      "potion-botanical-laboratory",
      37,
      56
    ],
    [
      "enchanted-music-hall",
      15,
      38
    ],
    [
      "field-astronomy",
      59,
      34
    ]
  ],
  "div": [
    [
      "x",
      33,
      11,
      28,
      18
    ],
    [
      "x",
      42,
      44,
      68,
      56
    ]
  ],
  "peak": [
    [
      16,
      19
    ],
    [
      58,
      19
    ],
    [
      37,
      8
    ],
    [
      15,
      57
    ],
    [
      59,
      59
    ],
    [
      37,
      56
    ],
    [
      15,
      38
    ],
    [
      59,
      34
    ]
  ],
  "roof": "luminbough-eight-shifted-cloisters-crowned-canopy-and-two-open-moonwells"
});
export const ROADMAP_C_4B_WAVE5_SCHOOL=Object.freeze((()=>{
 const base=buildDistinctive4B(ROADMAP_C_4B_WAVE5_PLAN);
 const candidate={...base,provenance:{...base.provenance,milestone:'M3-wave5',source:'Roadmap C source-authored eight-room forest conservatory',method:'eight separately located educational and arcane rooms, two genuine open-sky moonwells, double partition portals and shifted original bearing roof masses'}};
 validateBlueprint(candidate);return Object.freeze(candidate);
})());
export const ROADMAP_C_4B_WAVE5_SCHOOLS=Object.freeze([ROADMAP_C_4B_WAVE5_SCHOOL]);
export const ROADMAP_C_4B_151_ALL=Object.freeze([...ROADMAP_C_4B_150_ALL,ROADMAP_C_4B_WAVE5_SCHOOL]);
validateCollection(ROADMAP_C_4B_151_ALL);
if(ROADMAP_C_4B_151_ALL.length!==151||new Set(ROADMAP_C_4B_151_ALL.map(geometrySignature)).size!==151)throw Error('Luminbough original source duplicates or mutates previously accepted 4B designs');
