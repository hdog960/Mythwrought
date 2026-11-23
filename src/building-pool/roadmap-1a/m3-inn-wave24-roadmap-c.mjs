// MYTHWROUGHT Roadmap C Builder 1A #647 / Wave24: Cloverreach Twin-Bell Orchard Inn.
// Independent original temperate LARGE inn #006. SOURCE-ONLY / UNREGISTERED.
// Three genuine absent orchard courts, 14 reachable and partitioned original rooms,
// 21 two-high authentic portal openings, 14 supported distinct roof wings,
// 23 true original exterior Pack4 windows, four 2-cell physical Pack5 guest beds.
// Never registers runtime buildings, places settlements or touches saves/CI/main.
import {compileM2ArchitecturalSpec} from './m2-originals.mjs';
export const ROADMAP_C_1A_WAVE24_INN_SPECS=Object.freeze([
  {
    "category": "inn",
    "biome": "temperate",
    "size": "large",
    "index": 6,
    "title": "Cloverreach Twin-Bell Orchard Inn",
    "w": 70,
    "d": 60,
    "plan": "cloverreach-forked-three-orchard-courts-twin-bell-long-inn-fourteen-connected-rooms-original",
    "roof": "hip",
    "skin": "pack2:013",
    "roofAsset": "pack3:025",
    "exteriorNotches": [
      [
        0,
        0,
        22,
        20
      ],
      [
        51,
        0,
        69,
        24
      ],
      [
        0,
        42,
        20,
        59
      ]
    ],
    "segments": [
      [
        36,
        2,
        36,
        19
      ],
      [
        24,
        20,
        49,
        20
      ],
      [
        28,
        21,
        28,
        56
      ],
      [
        45,
        26,
        45,
        56
      ],
      [
        29,
        33,
        44,
        33
      ],
      [
        29,
        44,
        44,
        44
      ],
      [
        15,
        22,
        15,
        41
      ],
      [
        2,
        31,
        27,
        31
      ],
      [
        21,
        42,
        27,
        42
      ],
      [
        56,
        26,
        56,
        37
      ],
      [
        46,
        38,
        67,
        38
      ],
      [
        46,
        49,
        67,
        49
      ]
    ],
    "entry": [
      32,
      1,
      "oakway-foyer"
    ],
    "doors": [
      {
        "at": [
          36,
          1,
          10
        ],
        "from": "oakway-foyer",
        "to": "bell-harvest-dining"
      },
      {
        "at": [
          32,
          1,
          20
        ],
        "from": "oakway-foyer",
        "to": "throughway-gallery"
      },
      {
        "at": [
          40,
          1,
          20
        ],
        "from": "bell-harvest-dining",
        "to": "throughway-gallery"
      },
      {
        "at": [
          28,
          1,
          25
        ],
        "from": "throughway-gallery",
        "to": "west-cider-parlor"
      },
      {
        "at": [
          15,
          1,
          26
        ],
        "from": "west-orchard-breakfast",
        "to": "west-cider-parlor"
      },
      {
        "at": [
          8,
          1,
          31
        ],
        "from": "west-orchard-breakfast",
        "to": "west-hearth-kitchen"
      },
      {
        "at": [
          21,
          1,
          31
        ],
        "from": "west-cider-parlor",
        "to": "west-honey-bakery"
      },
      {
        "at": [
          15,
          1,
          36
        ],
        "from": "west-hearth-kitchen",
        "to": "west-honey-bakery"
      },
      {
        "at": [
          28,
          1,
          37
        ],
        "from": "west-honey-bakery",
        "to": "open-clover-skycourt"
      },
      {
        "at": [
          24,
          1,
          42
        ],
        "from": "west-honey-bakery",
        "to": "west-bellkeeper-room"
      },
      {
        "at": [
          28,
          1,
          50
        ],
        "from": "west-bellkeeper-room",
        "to": "lantern-map-library"
      },
      {
        "at": [
          34,
          1,
          33
        ],
        "from": "throughway-gallery",
        "to": "open-clover-skycourt"
      },
      {
        "at": [
          34,
          1,
          44
        ],
        "from": "open-clover-skycourt",
        "to": "lantern-map-library"
      },
      {
        "at": [
          45,
          1,
          29
        ],
        "from": "throughway-gallery",
        "to": "east-glass-conservatory"
      },
      {
        "at": [
          56,
          1,
          31
        ],
        "from": "east-glass-conservatory",
        "to": "east-bellwatch"
      },
      {
        "at": [
          50,
          1,
          38
        ],
        "from": "east-glass-conservatory",
        "to": "east-travel-cartography"
      },
      {
        "at": [
          61,
          1,
          38
        ],
        "from": "east-bellwatch",
        "to": "east-travel-cartography"
      },
      {
        "at": [
          54,
          1,
          49
        ],
        "from": "east-travel-cartography",
        "to": "east-guest-suite"
      },
      {
        "at": [
          45,
          1,
          41
        ],
        "from": "open-clover-skycourt",
        "to": "east-travel-cartography"
      },
      {
        "at": [
          45,
          1,
          52
        ],
        "from": "lantern-map-library",
        "to": "east-guest-suite"
      }
    ],
    "rooms": [
      {
        "id": "oakway-foyer",
        "min": [
          24,
          1,
          2
        ],
        "max": [
          36,
          4,
          20
        ]
      },
      {
        "id": "bell-harvest-dining",
        "min": [
          37,
          1,
          2
        ],
        "max": [
          50,
          4,
          20
        ]
      },
      {
        "id": "throughway-gallery",
        "min": [
          29,
          1,
          21
        ],
        "max": [
          45,
          4,
          33
        ]
      },
      {
        "id": "open-clover-skycourt",
        "min": [
          29,
          1,
          34
        ],
        "max": [
          45,
          4,
          44
        ]
      },
      {
        "id": "lantern-map-library",
        "min": [
          29,
          1,
          45
        ],
        "max": [
          45,
          4,
          57
        ]
      },
      {
        "id": "west-orchard-breakfast",
        "min": [
          3,
          1,
          22
        ],
        "max": [
          15,
          4,
          31
        ]
      },
      {
        "id": "west-cider-parlor",
        "min": [
          16,
          1,
          22
        ],
        "max": [
          28,
          4,
          31
        ]
      },
      {
        "id": "west-hearth-kitchen",
        "min": [
          3,
          1,
          32
        ],
        "max": [
          15,
          4,
          42
        ]
      },
      {
        "id": "west-honey-bakery",
        "min": [
          16,
          1,
          32
        ],
        "max": [
          28,
          4,
          42
        ]
      },
      {
        "id": "west-bellkeeper-room",
        "min": [
          22,
          1,
          43
        ],
        "max": [
          28,
          4,
          57
        ]
      },
      {
        "id": "east-glass-conservatory",
        "min": [
          46,
          1,
          26
        ],
        "max": [
          56,
          4,
          38
        ]
      },
      {
        "id": "east-bellwatch",
        "min": [
          57,
          1,
          26
        ],
        "max": [
          68,
          4,
          38
        ]
      },
      {
        "id": "east-travel-cartography",
        "min": [
          46,
          1,
          39
        ],
        "max": [
          68,
          4,
          49
        ]
      },
      {
        "id": "east-guest-suite",
        "min": [
          46,
          1,
          50
        ],
        "max": [
          68,
          4,
          57
        ]
      }
    ],
    "windows": [
      [
        28,
        1,
        "north"
      ],
      [
        44,
        1,
        "north"
      ],
      [
        48,
        1,
        "north"
      ],
      [
        23,
        6,
        "west"
      ],
      [
        23,
        15,
        "west"
      ],
      [
        50,
        6,
        "east"
      ],
      [
        50,
        14,
        "east"
      ],
      [
        7,
        21,
        "north"
      ],
      [
        19,
        21,
        "north"
      ],
      [
        54,
        25,
        "north"
      ],
      [
        63,
        25,
        "north"
      ],
      [
        1,
        27,
        "west"
      ],
      [
        1,
        35,
        "west"
      ],
      [
        8,
        41,
        "south"
      ],
      [
        17,
        41,
        "south"
      ],
      [
        21,
        48,
        "west"
      ],
      [
        21,
        54,
        "west"
      ],
      [
        68,
        31,
        "east"
      ],
      [
        68,
        43,
        "east"
      ],
      [
        68,
        52,
        "east"
      ],
      [
        30,
        58,
        "south"
      ],
      [
        42,
        58,
        "south"
      ],
      [
        60,
        58,
        "south"
      ]
    ],
    "courtyard": [
      33,
      35,
      40,
      42
    ],
    "roofWings": [
      {
        "name": "arrival-bell-rake",
        "rect": [
          23,
          1,
          35,
          19
        ],
        "style": "long-gable",
        "raise": 1
      },
      {
        "name": "harvest-dining-gable",
        "rect": [
          37,
          1,
          50,
          19
        ],
        "style": "edge-rise",
        "raise": 2
      },
      {
        "name": "orchard-breakfast-walk",
        "rect": [
          2,
          22,
          14,
          30
        ],
        "style": "double-hill",
        "raise": 1
      },
      {
        "name": "cider-parlor-walk",
        "rect": [
          16,
          22,
          27,
          30
        ],
        "style": "step-front",
        "raise": 2
      },
      {
        "name": "hearth-kitchen-pavilion",
        "rect": [
          2,
          32,
          14,
          41
        ],
        "style": "long-gable",
        "raise": 1
      },
      {
        "name": "honey-bakery-pavilion",
        "rect": [
          16,
          32,
          27,
          41
        ],
        "style": "double-hill",
        "raise": 2
      },
      {
        "name": "bellkeeper-overlook",
        "rect": [
          21,
          43,
          27,
          57
        ],
        "style": "edge-rise",
        "raise": 1
      },
      {
        "name": "bell-concourse-roof",
        "rect": [
          29,
          21,
          44,
          32
        ],
        "style": "long-gable",
        "raise": 2
      },
      {
        "name": "open-clover-skycourt-ring",
        "rect": [
          29,
          34,
          44,
          43
        ],
        "style": "double-hill",
        "raise": 1
      },
      {
        "name": "map-library-ribbed-vault",
        "rect": [
          29,
          45,
          44,
          57
        ],
        "style": "step-front",
        "raise": 2
      },
      {
        "name": "glass-conservatory-fan",
        "rect": [
          46,
          26,
          55,
          37
        ],
        "style": "edge-rise",
        "raise": 1
      },
      {
        "name": "east-bellwatch-canopy",
        "rect": [
          57,
          26,
          67,
          37
        ],
        "style": "long-gable",
        "raise": 2
      },
      {
        "name": "wayfarer-cartography-truss",
        "rect": [
          46,
          39,
          67,
          48
        ],
        "style": "double-hill",
        "raise": 1
      },
      {
        "name": "guest-sleeping-bays",
        "rect": [
          46,
          50,
          67,
          57
        ],
        "style": "step-front",
        "raise": 2
      }
    ],
    "fixtures": [
      {
        "x": 27,
        "z": 6,
        "room": "oakway-foyer",
        "asset": "pack4:059"
      },
      {
        "x": 32,
        "z": 12,
        "room": "oakway-foyer",
        "asset": "pack4:058"
      },
      {
        "x": 40,
        "z": 6,
        "room": "bell-harvest-dining",
        "asset": "pack4:064"
      },
      {
        "x": 45,
        "z": 12,
        "room": "bell-harvest-dining",
        "asset": "pack4:059"
      },
      {
        "x": 32,
        "z": 24,
        "room": "throughway-gallery",
        "asset": "pack4:059"
      },
      {
        "x": 39,
        "z": 28,
        "room": "throughway-gallery",
        "asset": "pack4:058"
      },
      {
        "x": 30,
        "z": 37,
        "room": "open-clover-skycourt",
        "asset": "pack4:064"
      },
      {
        "x": 43,
        "z": 40,
        "room": "open-clover-skycourt",
        "asset": "pack4:059"
      },
      {
        "x": 31,
        "z": 48,
        "room": "lantern-map-library",
        "asset": "pack5:084"
      },
      {
        "x": 40,
        "z": 52,
        "room": "lantern-map-library",
        "asset": "pack4:058"
      },
      {
        "x": 6,
        "z": 25,
        "room": "west-orchard-breakfast",
        "asset": "pack4:059"
      },
      {
        "x": 11,
        "z": 28,
        "room": "west-orchard-breakfast",
        "asset": "pack4:058"
      },
      {
        "x": 18,
        "z": 25,
        "room": "west-cider-parlor",
        "asset": "pack4:064"
      },
      {
        "x": 23,
        "z": 28,
        "room": "west-cider-parlor",
        "asset": "pack4:059"
      },
      {
        "x": 6,
        "z": 35,
        "room": "west-hearth-kitchen",
        "asset": "pack4:064"
      },
      {
        "x": 11,
        "z": 39,
        "room": "west-hearth-kitchen",
        "asset": "pack4:058"
      },
      {
        "x": 19,
        "z": 35,
        "room": "west-honey-bakery",
        "asset": "pack4:059"
      },
      {
        "x": 24,
        "z": 39,
        "room": "west-honey-bakery",
        "asset": "pack4:064"
      },
      {
        "x": 23,
        "z": 46,
        "room": "west-bellkeeper-room",
        "asset": "pack4:058"
      },
      {
        "x": 24,
        "z": 51,
        "room": "west-bellkeeper-room",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 48,
        "z": 28,
        "room": "east-glass-conservatory",
        "asset": "pack4:059"
      },
      {
        "x": 52,
        "z": 34,
        "room": "east-glass-conservatory",
        "asset": "pack4:064"
      },
      {
        "x": 60,
        "z": 29,
        "room": "east-bellwatch",
        "asset": "pack4:058"
      },
      {
        "x": 64,
        "z": 34,
        "room": "east-bellwatch",
        "asset": "pack4:059"
      },
      {
        "x": 49,
        "z": 42,
        "room": "east-travel-cartography",
        "asset": "pack5:084"
      },
      {
        "x": 59,
        "z": 44,
        "room": "east-travel-cartography",
        "asset": "pack4:058"
      },
      {
        "x": 49,
        "z": 52,
        "room": "east-guest-suite",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 59,
        "z": 52,
        "room": "east-guest-suite",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 65,
        "z": 54,
        "room": "east-guest-suite",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "posts": [
      29,
      41
    ],
    "detail": "An original temperate large three-orchard-cut wayfarers inn with two separate bell-bearing north pavilions, a traversable reception-to-skycourt-to-library axis, nine purpose-built kitchen, cider, breakfast, glass conservatory, bellwatch, service and cartography rooms, a real grounded open-air clovercourt, fourteen independently backed roof wings, twenty-three glazed true wall openings over exterior orchard voids, four physical two-cell Pack5 guest-bed reservations and accessible long south guest suites. New unregistered source-only geometry; no weather/load, live world, settlement, runtime or save ABI approval."
  }
]);
export const ROADMAP_C_1A_WAVE24_INN_IDS=Object.freeze(ROADMAP_C_1A_WAVE24_INN_SPECS.map(x=>'r1:'+x.category+':'+x.biome+':'+x.size+':'+String(x.index).padStart(3,'0')));
export function getRoadmapC1AInnWave24(){return ROADMAP_C_1A_WAVE24_INN_SPECS.map(compileM2ArchitecturalSpec);}
