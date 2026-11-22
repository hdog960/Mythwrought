// MYTHWROUGHT Roadmap C Builder 1A Wave21 — original Moonwillow Lanternring Inn.
// SOURCE-ONLY, unregistered candidate. No settlements, main, saves/schema,
// original historical 1A assets, automation lanes, or v0.11 changes.
// Explicit original-coordinate enchanted-forest large inn #005, 16 genuine rooms,
// 29 fully open named-room thresholds + entry, three fully absent forest glades,
// 63 grounded roof-open moonwillow columns, 16 physical pitched roof wings,
// 19 original Pack4 windows including four absent-forest-notch view corridors,
// and eight original two-cell Pack5 bed reservations. Original source approval pending.
import {compileM2ArchitecturalSpec} from './m2-originals.mjs';
export const ROADMAP_C_1A_WAVE21_INN_SPECS=Object.freeze([
  {
    "category": "inn",
    "biome": "enchanted-forest",
    "size": "large",
    "index": 5,
    "title": "Moonwillow Lanternring Inn",
    "w": 68,
    "d": 58,
    "plan": "moonwillow-three-forest-glades-mid-grove-lanternring-conservatory-guest-arcades-original",
    "roof": "steep",
    "skin": "pack2:013",
    "roofAsset": "pack3:025",
    "exteriorNotches": [
      [
        0,
        0,
        16,
        15
      ],
      [
        0,
        47,
        13,
        57
      ],
      [
        57,
        24,
        67,
        38
      ]
    ],
    "segments": [
      [
        22,
        16,
        22,
        56
      ],
      [
        43,
        2,
        43,
        56
      ],
      [
        23,
        16,
        43,
        16
      ],
      [
        23,
        35,
        43,
        35
      ],
      [
        23,
        45,
        43,
        45
      ],
      [
        2,
        27,
        22,
        27
      ],
      [
        2,
        36,
        22,
        36
      ],
      [
        12,
        28,
        12,
        36
      ],
      [
        14,
        46,
        22,
        46
      ],
      [
        44,
        12,
        66,
        12
      ],
      [
        44,
        24,
        56,
        24
      ],
      [
        44,
        38,
        56,
        38
      ],
      [
        44,
        46,
        66,
        46
      ],
      [
        50,
        25,
        50,
        38
      ],
      [
        55,
        47,
        55,
        56
      ]
    ],
    "entry": [
      32,
      1,
      "north-wisp-vestibule"
    ],
    "rooms": [
      {
        "id": "north-wisp-vestibule",
        "min": [
          23,
          1,
          2
        ],
        "max": [
          43,
          4,
          16
        ]
      },
      {
        "id": "west-firefly-kitchen",
        "min": [
          2,
          1,
          16
        ],
        "max": [
          22,
          4,
          27
        ]
      },
      {
        "id": "west-moss-pantry",
        "min": [
          2,
          1,
          28
        ],
        "max": [
          12,
          4,
          36
        ]
      },
      {
        "id": "west-lantern-artisan",
        "min": [
          13,
          1,
          28
        ],
        "max": [
          22,
          4,
          36
        ]
      },
      {
        "id": "west-amber-bunkhouse",
        "min": [
          2,
          1,
          37
        ],
        "max": [
          22,
          4,
          46
        ]
      },
      {
        "id": "southwest-moonwillow-guest",
        "min": [
          14,
          1,
          47
        ],
        "max": [
          22,
          4,
          57
        ]
      },
      {
        "id": "central-lantern-gallery",
        "min": [
          23,
          1,
          17
        ],
        "max": [
          43,
          4,
          35
        ]
      },
      {
        "id": "central-open-willow-grove",
        "min": [
          23,
          1,
          36
        ],
        "max": [
          43,
          4,
          45
        ]
      },
      {
        "id": "south-lantern-commons",
        "min": [
          23,
          1,
          46
        ],
        "max": [
          43,
          4,
          57
        ]
      },
      {
        "id": "east-glowcap-observatory",
        "min": [
          44,
          1,
          2
        ],
        "max": [
          66,
          4,
          12
        ]
      },
      {
        "id": "east-map-and-lore-archive",
        "min": [
          44,
          1,
          13
        ],
        "max": [
          66,
          4,
          24
        ]
      },
      {
        "id": "east-moonfern-tea-gallery",
        "min": [
          44,
          1,
          25
        ],
        "max": [
          50,
          4,
          38
        ]
      },
      {
        "id": "east-herbal-apothecary",
        "min": [
          51,
          1,
          25
        ],
        "max": [
          56,
          4,
          38
        ]
      },
      {
        "id": "east-spring-bathhouse",
        "min": [
          44,
          1,
          39
        ],
        "max": [
          66,
          4,
          46
        ]
      },
      {
        "id": "east-moonbeam-suites",
        "min": [
          44,
          1,
          47
        ],
        "max": [
          55,
          4,
          57
        ]
      },
      {
        "id": "east-dreamweaver-suites",
        "min": [
          56,
          1,
          47
        ],
        "max": [
          66,
          4,
          57
        ]
      }
    ],
    "doors": [
      {
        "at": [
          32,
          1,
          16
        ],
        "from": "north-wisp-vestibule",
        "to": "central-lantern-gallery"
      },
      {
        "at": [
          43,
          1,
          8
        ],
        "from": "north-wisp-vestibule",
        "to": "east-glowcap-observatory"
      },
      {
        "at": [
          43,
          1,
          14
        ],
        "from": "north-wisp-vestibule",
        "to": "east-map-and-lore-archive"
      },
      {
        "at": [
          43,
          1,
          20
        ],
        "from": "central-lantern-gallery",
        "to": "east-map-and-lore-archive"
      },
      {
        "at": [
          53,
          1,
          12
        ],
        "from": "east-glowcap-observatory",
        "to": "east-map-and-lore-archive"
      },
      {
        "at": [
          22,
          1,
          22
        ],
        "from": "central-lantern-gallery",
        "to": "west-firefly-kitchen"
      },
      {
        "at": [
          7,
          1,
          27
        ],
        "from": "west-firefly-kitchen",
        "to": "west-moss-pantry"
      },
      {
        "at": [
          18,
          1,
          27
        ],
        "from": "west-firefly-kitchen",
        "to": "west-lantern-artisan"
      },
      {
        "at": [
          12,
          1,
          32
        ],
        "from": "west-moss-pantry",
        "to": "west-lantern-artisan"
      },
      {
        "at": [
          8,
          1,
          36
        ],
        "from": "west-moss-pantry",
        "to": "west-amber-bunkhouse"
      },
      {
        "at": [
          18,
          1,
          36
        ],
        "from": "west-lantern-artisan",
        "to": "west-amber-bunkhouse"
      },
      {
        "at": [
          18,
          1,
          46
        ],
        "from": "west-amber-bunkhouse",
        "to": "southwest-moonwillow-guest"
      },
      {
        "at": [
          22,
          1,
          50
        ],
        "from": "southwest-moonwillow-guest",
        "to": "south-lantern-commons"
      },
      {
        "at": [
          32,
          1,
          35
        ],
        "from": "central-lantern-gallery",
        "to": "central-open-willow-grove"
      },
      {
        "at": [
          32,
          1,
          45
        ],
        "from": "central-open-willow-grove",
        "to": "south-lantern-commons"
      },
      {
        "at": [
          43,
          1,
          29
        ],
        "from": "central-lantern-gallery",
        "to": "east-moonfern-tea-gallery"
      },
      {
        "at": [
          50,
          1,
          30
        ],
        "from": "east-moonfern-tea-gallery",
        "to": "east-herbal-apothecary"
      },
      {
        "at": [
          53,
          1,
          24
        ],
        "from": "east-map-and-lore-archive",
        "to": "east-herbal-apothecary"
      },
      {
        "at": [
          47,
          1,
          24
        ],
        "from": "east-map-and-lore-archive",
        "to": "east-moonfern-tea-gallery"
      },
      {
        "at": [
          43,
          1,
          41
        ],
        "from": "central-open-willow-grove",
        "to": "east-spring-bathhouse"
      },
      {
        "at": [
          43,
          1,
          50
        ],
        "from": "south-lantern-commons",
        "to": "east-moonbeam-suites"
      },
      {
        "at": [
          49,
          1,
          46
        ],
        "from": "east-spring-bathhouse",
        "to": "east-moonbeam-suites"
      },
      {
        "at": [
          60,
          1,
          46
        ],
        "from": "east-spring-bathhouse",
        "to": "east-dreamweaver-suites"
      },
      {
        "at": [
          55,
          1,
          51
        ],
        "from": "east-moonbeam-suites",
        "to": "east-dreamweaver-suites"
      },
      {
        "at": [
          22,
          1,
          32
        ],
        "from": "central-lantern-gallery",
        "to": "west-lantern-artisan"
      },
      {
        "at": [
          22,
          1,
          41
        ],
        "from": "central-open-willow-grove",
        "to": "west-amber-bunkhouse"
      },
      {
        "at": [
          43,
          1,
          34
        ],
        "from": "central-lantern-gallery",
        "to": "east-moonfern-tea-gallery"
      },
      {
        "at": [
          54,
          1,
          38
        ],
        "from": "east-herbal-apothecary",
        "to": "east-spring-bathhouse"
      },
      {
        "at": [
          46,
          1,
          38
        ],
        "from": "east-moonfern-tea-gallery",
        "to": "east-spring-bathhouse"
      }
    ],
    "windows": [
      [
        27,
        1,
        "north"
      ],
      [
        35,
        1,
        "north"
      ],
      [
        47,
        1,
        "north"
      ],
      [
        59,
        1,
        "north"
      ],
      [
        17,
        9,
        "west"
      ],
      [
        1,
        20,
        "west"
      ],
      [
        1,
        31,
        "west"
      ],
      [
        1,
        42,
        "west"
      ],
      [
        14,
        52,
        "west"
      ],
      [
        66,
        7,
        "east"
      ],
      [
        66,
        17,
        "east"
      ],
      [
        56,
        29,
        "east"
      ],
      [
        56,
        35,
        "east"
      ],
      [
        66,
        42,
        "east"
      ],
      [
        66,
        52,
        "east"
      ],
      [
        28,
        56,
        "south"
      ],
      [
        38,
        56,
        "south"
      ],
      [
        48,
        56,
        "south"
      ],
      [
        61,
        56,
        "south"
      ]
    ],
    "fixtures": [
      {
        "x": 28,
        "z": 7,
        "room": "north-wisp-vestibule",
        "asset": "pack4:059"
      },
      {
        "x": 37,
        "z": 8,
        "room": "north-wisp-vestibule",
        "asset": "pack4:058"
      },
      {
        "x": 7,
        "z": 20,
        "room": "west-firefly-kitchen",
        "asset": "pack4:064"
      },
      {
        "x": 7,
        "z": 31,
        "room": "west-moss-pantry",
        "asset": "pack5:084"
      },
      {
        "x": 17,
        "z": 31,
        "room": "west-lantern-artisan",
        "asset": "pack4:058"
      },
      {
        "x": 5,
        "z": 40,
        "room": "west-amber-bunkhouse",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 12,
        "z": 40,
        "room": "west-amber-bunkhouse",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 16,
        "z": 50,
        "room": "southwest-moonwillow-guest",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 26,
        "z": 21,
        "room": "central-lantern-gallery",
        "asset": "pack4:059"
      },
      {
        "x": 36,
        "z": 24,
        "room": "central-lantern-gallery",
        "asset": "pack4:058"
      },
      {
        "x": 26,
        "z": 40,
        "room": "central-open-willow-grove",
        "asset": "pack4:059"
      },
      {
        "x": 26,
        "z": 49,
        "room": "south-lantern-commons",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 36,
        "z": 50,
        "room": "south-lantern-commons",
        "asset": "pack4:064"
      },
      {
        "x": 49,
        "z": 7,
        "room": "east-glowcap-observatory",
        "asset": "pack4:059"
      },
      {
        "x": 53,
        "z": 17,
        "room": "east-map-and-lore-archive",
        "asset": "pack5:084"
      },
      {
        "x": 46,
        "z": 29,
        "room": "east-moonfern-tea-gallery",
        "asset": "pack4:059"
      },
      {
        "x": 53,
        "z": 33,
        "room": "east-herbal-apothecary",
        "asset": "pack4:058"
      },
      {
        "x": 49,
        "z": 42,
        "room": "east-spring-bathhouse",
        "asset": "pack4:064"
      },
      {
        "x": 46,
        "z": 51,
        "room": "east-moonbeam-suites",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 51,
        "z": 51,
        "room": "east-moonbeam-suites",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 59,
        "z": 51,
        "room": "east-dreamweaver-suites",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 63,
        "z": 51,
        "room": "east-dreamweaver-suites",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 60,
        "z": 53,
        "room": "east-dreamweaver-suites",
        "asset": "pack4:059"
      }
    ],
    "roofWings": [
      {
        "name": "west-firefly-kitchen-thatch",
        "rect": [
          0,
          16,
          22,
          27
        ],
        "style": "long-gable",
        "raise": 1
      },
      {
        "name": "west-moss-pantry-canopy",
        "rect": [
          0,
          28,
          12,
          36
        ],
        "style": "edge-rise",
        "raise": 1
      },
      {
        "name": "west-lantern-artisan-sawroof",
        "rect": [
          13,
          28,
          22,
          36
        ],
        "style": "step-front",
        "raise": 2
      },
      {
        "name": "west-amber-bunks-crescent",
        "rect": [
          0,
          37,
          22,
          46
        ],
        "style": "double-hill",
        "raise": 2
      },
      {
        "name": "southwest-moonwillow-guest-ridge",
        "rect": [
          14,
          47,
          22,
          57
        ],
        "style": "long-gable",
        "raise": 1
      },
      {
        "name": "north-lantern-hall-moonspire",
        "rect": [
          17,
          0,
          43,
          16
        ],
        "style": "double-hill",
        "raise": 2
      },
      {
        "name": "middle-lantern-gallery-vault",
        "rect": [
          23,
          17,
          43,
          35
        ],
        "style": "step-front",
        "raise": 1
      },
      {
        "name": "central-grove-ring-shingle",
        "rect": [
          23,
          36,
          43,
          45
        ],
        "style": "double-hill",
        "raise": 2
      },
      {
        "name": "south-moonlit-commons-roof",
        "rect": [
          23,
          46,
          43,
          57
        ],
        "style": "long-gable",
        "raise": 1
      },
      {
        "name": "east-glowcap-observatory-roof",
        "rect": [
          44,
          0,
          67,
          12
        ],
        "style": "long-gable",
        "raise": 2
      },
      {
        "name": "east-map-and-lore-terrace",
        "rect": [
          44,
          13,
          67,
          24
        ],
        "style": "step-front",
        "raise": 1
      },
      {
        "name": "east-moonfern-tea-pavilion",
        "rect": [
          44,
          25,
          50,
          38
        ],
        "style": "double-hill",
        "raise": 2
      },
      {
        "name": "east-herbal-apothecary-canopy",
        "rect": [
          51,
          25,
          56,
          38
        ],
        "style": "edge-rise",
        "raise": 1
      },
      {
        "name": "east-spring-bathhouse-crosspitch",
        "rect": [
          44,
          39,
          67,
          46
        ],
        "style": "double-hill",
        "raise": 2
      },
      {
        "name": "east-moonbeam-guest-wing",
        "rect": [
          44,
          47,
          55,
          57
        ],
        "style": "long-gable",
        "raise": 1
      },
      {
        "name": "east-dreamweaver-guest-roof",
        "rect": [
          56,
          47,
          67,
          57
        ],
        "style": "step-front",
        "raise": 2
      }
    ],
    "courtyard": [
      29,
      38,
      37,
      44
    ],
    "posts": [
      29,
      39
    ],
    "detail": "Enchanted forest original source-only crescent-ring inn with three real grove openings, 16 physically distinct and connected lodging/tea/bath/conservatory rooms, 29 true two-high room-to-room portals plus exterior entry, a fully sky-open moonwillow nine-by-seven lanternring grove, sixteen independently varied Pack3 roof structures, nineteen original Pack4 exterior windows with four physically absent-forest-notch vistas, and eight Pack5 reserved twin-cell guest beds; magic aesthetic without live world registration or artificial building placements."
  }
]);
export const ROADMAP_C_1A_WAVE21_INN_IDS=Object.freeze(ROADMAP_C_1A_WAVE21_INN_SPECS.map(s=>'r1:'+s.category+':'+s.biome+':'+s.size+':'+String(s.index).padStart(3,'0')));
export function getRoadmapC1AInnWave21(){return ROADMAP_C_1A_WAVE21_INN_SPECS.map(compileM2ArchitecturalSpec);}
