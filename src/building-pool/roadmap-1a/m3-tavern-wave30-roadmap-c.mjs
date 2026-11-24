// MYTHWROUGHT Roadmap C Builder 1A original #653 / Wave30 Frostweir Starfall Ribbon Tavern.
// Source-only literal original snow/large tavern 002, with true asymmetric glacier voids,
// twenty independent rooms, physical door and Pack4 apertures, backed Pack3 roofing,
// and four original Pack5 two-cell bed reservations. No production registration,
// settlement generation, save/schema, old source/CI edits or deployment.
import {compileM2ArchitecturalSpec} from './m2-originals.mjs';
export const ROADMAP_C_1A_WAVE30_TAVERN_SPECS=Object.freeze([
  {
    "category": "tavern",
    "biome": "snow",
    "size": "large",
    "index": 2,
    "title": "Frostweir Starfall Ribbon Tavern",
    "w": 84,
    "d": 70,
    "plan": "frostweir-snow-triple-asymmetric-aurora-chasm-cross-gallery-outboard-sledbarn-original",
    "roof": "steep",
    "skin": "live:wood",
    "roofAsset": "pack3:025",
    "exteriorNotches": [
      [
        0,
        0,
        24,
        26
      ],
      [
        64,
        0,
        83,
        13
      ],
      [
        65,
        55,
        83,
        69
      ]
    ],
    "segments": [
      [
        35,
        2,
        35,
        67
      ],
      [
        48,
        2,
        48,
        67
      ],
      [
        64,
        14,
        64,
        54
      ],
      [
        20,
        27,
        20,
        67
      ],
      [
        25,
        14,
        35,
        14
      ],
      [
        25,
        26,
        35,
        26
      ],
      [
        21,
        38,
        35,
        38
      ],
      [
        21,
        52,
        35,
        52
      ],
      [
        2,
        42,
        20,
        42
      ],
      [
        36,
        14,
        47,
        14
      ],
      [
        36,
        28,
        47,
        28
      ],
      [
        36,
        41,
        47,
        41
      ],
      [
        36,
        54,
        47,
        54
      ],
      [
        49,
        13,
        63,
        13
      ],
      [
        49,
        29,
        63,
        29
      ],
      [
        49,
        43,
        63,
        43
      ],
      [
        49,
        55,
        63,
        55
      ],
      [
        65,
        29,
        81,
        29
      ],
      [
        65,
        43,
        81,
        43
      ]
    ],
    "entry": [
      41,
      1,
      "north-starfall-vestibule"
    ],
    "doors": [
      {
        "at": [
          41,
          1,
          14
        ],
        "from": "north-starfall-vestibule",
        "to": "north-pineglass-feast-hall"
      },
      {
        "at": [
          41,
          1,
          28
        ],
        "from": "north-pineglass-feast-hall",
        "to": "central-open-aurora-well"
      },
      {
        "at": [
          41,
          1,
          41
        ],
        "from": "central-open-aurora-well",
        "to": "south-emberwine-gallery"
      },
      {
        "at": [
          41,
          1,
          54
        ],
        "from": "south-emberwine-gallery",
        "to": "south-hearthkeeper-commons"
      },
      {
        "at": [
          30,
          1,
          14
        ],
        "from": "west-icechart-library",
        "to": "west-frostsignal-belfry"
      },
      {
        "at": [
          30,
          1,
          26
        ],
        "from": "west-frostsignal-belfry",
        "to": "west-ale-and-amber-parlor"
      },
      {
        "at": [
          29,
          1,
          38
        ],
        "from": "west-ale-and-amber-parlor",
        "to": "west-cinder-kitchen"
      },
      {
        "at": [
          29,
          1,
          52
        ],
        "from": "west-cinder-kitchen",
        "to": "west-warmstone-lodging"
      },
      {
        "at": [
          11,
          1,
          42
        ],
        "from": "far-west-sled-menders-taproom",
        "to": "far-west-winter-festival-barn"
      },
      {
        "at": [
          56,
          1,
          13
        ],
        "from": "east-icepetal-tearoom",
        "to": "east-hot-cider-arcade"
      },
      {
        "at": [
          56,
          1,
          29
        ],
        "from": "east-hot-cider-arcade",
        "to": "east-starseed-songroom"
      },
      {
        "at": [
          56,
          1,
          43
        ],
        "from": "east-starseed-songroom",
        "to": "east-glacier-map-parlor"
      },
      {
        "at": [
          56,
          1,
          55
        ],
        "from": "east-glacier-map-parlor",
        "to": "east-quiet-guest-quarters"
      },
      {
        "at": [
          73,
          1,
          29
        ],
        "from": "far-east-northern-lights-deck",
        "to": "far-east-snowbell-workshop"
      },
      {
        "at": [
          73,
          1,
          43
        ],
        "from": "far-east-snowbell-workshop",
        "to": "far-east-winter-bath-gallery"
      },
      {
        "at": [
          35,
          1,
          7
        ],
        "from": "north-starfall-vestibule",
        "to": "west-icechart-library"
      },
      {
        "at": [
          35,
          1,
          19
        ],
        "from": "north-pineglass-feast-hall",
        "to": "west-frostsignal-belfry"
      },
      {
        "at": [
          35,
          1,
          32
        ],
        "from": "central-open-aurora-well",
        "to": "west-ale-and-amber-parlor"
      },
      {
        "at": [
          35,
          1,
          46
        ],
        "from": "south-emberwine-gallery",
        "to": "west-cinder-kitchen"
      },
      {
        "at": [
          35,
          1,
          61
        ],
        "from": "south-hearthkeeper-commons",
        "to": "west-warmstone-lodging"
      },
      {
        "at": [
          48,
          1,
          7
        ],
        "from": "north-starfall-vestibule",
        "to": "east-icepetal-tearoom"
      },
      {
        "at": [
          48,
          1,
          21
        ],
        "from": "north-pineglass-feast-hall",
        "to": "east-hot-cider-arcade"
      },
      {
        "at": [
          48,
          1,
          35
        ],
        "from": "central-open-aurora-well",
        "to": "east-starseed-songroom"
      },
      {
        "at": [
          48,
          1,
          48
        ],
        "from": "south-emberwine-gallery",
        "to": "east-glacier-map-parlor"
      },
      {
        "at": [
          48,
          1,
          62
        ],
        "from": "south-hearthkeeper-commons",
        "to": "east-quiet-guest-quarters"
      },
      {
        "at": [
          20,
          1,
          32
        ],
        "from": "far-west-sled-menders-taproom",
        "to": "west-ale-and-amber-parlor"
      },
      {
        "at": [
          20,
          1,
          40
        ],
        "from": "far-west-sled-menders-taproom",
        "to": "west-cinder-kitchen"
      },
      {
        "at": [
          20,
          1,
          47
        ],
        "from": "far-west-winter-festival-barn",
        "to": "west-cinder-kitchen"
      },
      {
        "at": [
          20,
          1,
          60
        ],
        "from": "far-west-winter-festival-barn",
        "to": "west-warmstone-lodging"
      },
      {
        "at": [
          64,
          1,
          22
        ],
        "from": "east-hot-cider-arcade",
        "to": "far-east-northern-lights-deck"
      },
      {
        "at": [
          64,
          1,
          36
        ],
        "from": "east-starseed-songroom",
        "to": "far-east-snowbell-workshop"
      },
      {
        "at": [
          64,
          1,
          49
        ],
        "from": "east-glacier-map-parlor",
        "to": "far-east-winter-bath-gallery"
      }
    ],
    "rooms": [
      {
        "id": "north-starfall-vestibule",
        "min": [
          36,
          1,
          2
        ],
        "max": [
          48,
          4,
          14
        ]
      },
      {
        "id": "north-pineglass-feast-hall",
        "min": [
          36,
          1,
          15
        ],
        "max": [
          48,
          4,
          28
        ]
      },
      {
        "id": "central-open-aurora-well",
        "min": [
          36,
          1,
          29
        ],
        "max": [
          48,
          4,
          41
        ]
      },
      {
        "id": "south-emberwine-gallery",
        "min": [
          36,
          1,
          42
        ],
        "max": [
          48,
          4,
          54
        ]
      },
      {
        "id": "south-hearthkeeper-commons",
        "min": [
          36,
          1,
          55
        ],
        "max": [
          48,
          4,
          68
        ]
      },
      {
        "id": "west-icechart-library",
        "min": [
          26,
          1,
          2
        ],
        "max": [
          35,
          4,
          14
        ]
      },
      {
        "id": "west-frostsignal-belfry",
        "min": [
          26,
          1,
          15
        ],
        "max": [
          35,
          4,
          26
        ]
      },
      {
        "id": "west-ale-and-amber-parlor",
        "min": [
          21,
          1,
          27
        ],
        "max": [
          35,
          4,
          38
        ]
      },
      {
        "id": "west-cinder-kitchen",
        "min": [
          21,
          1,
          39
        ],
        "max": [
          35,
          4,
          52
        ]
      },
      {
        "id": "west-warmstone-lodging",
        "min": [
          21,
          1,
          53
        ],
        "max": [
          35,
          4,
          68
        ]
      },
      {
        "id": "far-west-sled-menders-taproom",
        "min": [
          2,
          1,
          27
        ],
        "max": [
          20,
          4,
          42
        ]
      },
      {
        "id": "far-west-winter-festival-barn",
        "min": [
          2,
          1,
          43
        ],
        "max": [
          20,
          4,
          68
        ]
      },
      {
        "id": "east-icepetal-tearoom",
        "min": [
          49,
          1,
          2
        ],
        "max": [
          63,
          4,
          13
        ]
      },
      {
        "id": "east-hot-cider-arcade",
        "min": [
          49,
          1,
          14
        ],
        "max": [
          64,
          4,
          29
        ]
      },
      {
        "id": "east-starseed-songroom",
        "min": [
          49,
          1,
          30
        ],
        "max": [
          64,
          4,
          43
        ]
      },
      {
        "id": "east-glacier-map-parlor",
        "min": [
          49,
          1,
          44
        ],
        "max": [
          64,
          4,
          55
        ]
      },
      {
        "id": "east-quiet-guest-quarters",
        "min": [
          49,
          1,
          56
        ],
        "max": [
          64,
          4,
          68
        ]
      },
      {
        "id": "far-east-northern-lights-deck",
        "min": [
          65,
          1,
          15
        ],
        "max": [
          82,
          4,
          29
        ]
      },
      {
        "id": "far-east-snowbell-workshop",
        "min": [
          65,
          1,
          30
        ],
        "max": [
          82,
          4,
          43
        ]
      },
      {
        "id": "far-east-winter-bath-gallery",
        "min": [
          65,
          1,
          44
        ],
        "max": [
          82,
          4,
          54
        ]
      }
    ],
    "windows": [
      [
        30,
        1,
        "north"
      ],
      [
        44,
        1,
        "north"
      ],
      [
        54,
        1,
        "north"
      ],
      [
        25,
        7,
        "west"
      ],
      [
        25,
        20,
        "west"
      ],
      [
        63,
        6,
        "east"
      ],
      [
        63,
        11,
        "east"
      ],
      [
        1,
        30,
        "west"
      ],
      [
        1,
        39,
        "west"
      ],
      [
        1,
        54,
        "west"
      ],
      [
        1,
        63,
        "west"
      ],
      [
        82,
        21,
        "east"
      ],
      [
        82,
        33,
        "east"
      ],
      [
        82,
        47,
        "east"
      ],
      [
        64,
        60,
        "east"
      ],
      [
        64,
        65,
        "east"
      ],
      [
        14,
        68,
        "south"
      ],
      [
        29,
        68,
        "south"
      ],
      [
        41,
        68,
        "south"
      ],
      [
        57,
        68,
        "south"
      ],
      [
        70,
        14,
        "north"
      ],
      [
        77,
        14,
        "north"
      ],
      [
        70,
        54,
        "south"
      ],
      [
        78,
        54,
        "south"
      ]
    ],
    "courtyard": [
      39,
      31,
      44,
      38
    ],
    "roofWings": [
      {
        "name": "western-icechart-gable",
        "rect": [
          25,
          2,
          35,
          14
        ],
        "style": "long-gable",
        "raise": 1
      },
      {
        "name": "western-signal-lantern-spire",
        "rect": [
          25,
          15,
          35,
          26
        ],
        "style": "step-front",
        "raise": 2
      },
      {
        "name": "western-amber-hearth",
        "rect": [
          21,
          27,
          35,
          38
        ],
        "style": "double-hill",
        "raise": 0
      },
      {
        "name": "western-glacier-kitchen",
        "rect": [
          21,
          39,
          35,
          52
        ],
        "style": "edge-rise",
        "raise": 1
      },
      {
        "name": "western-guest-warmth",
        "rect": [
          21,
          53,
          35,
          68
        ],
        "style": "long-gable",
        "raise": 2
      },
      {
        "name": "far-west-sled-arcade",
        "rect": [
          1,
          27,
          20,
          42
        ],
        "style": "step-front",
        "raise": 1
      },
      {
        "name": "far-west-barn-ridge",
        "rect": [
          1,
          43,
          20,
          68
        ],
        "style": "double-hill",
        "raise": 0
      },
      {
        "name": "starfall-entrance-ridge",
        "rect": [
          36,
          2,
          47,
          14
        ],
        "style": "edge-rise",
        "raise": 0
      },
      {
        "name": "pineglass-double-mead-ridge",
        "rect": [
          36,
          15,
          47,
          28
        ],
        "style": "double-hill",
        "raise": 2
      },
      {
        "name": "roof-open-aurora-ring",
        "rect": [
          36,
          29,
          47,
          41
        ],
        "style": "long-gable",
        "raise": 1
      },
      {
        "name": "south-emberwine-spine",
        "rect": [
          36,
          42,
          47,
          54
        ],
        "style": "edge-rise",
        "raise": 1
      },
      {
        "name": "south-commons-lantern",
        "rect": [
          36,
          55,
          47,
          68
        ],
        "style": "step-front",
        "raise": 2
      },
      {
        "name": "northeast-icepetal-lean",
        "rect": [
          48,
          2,
          63,
          13
        ],
        "style": "edge-rise",
        "raise": 2
      },
      {
        "name": "east-hot-cider-warm-ridge",
        "rect": [
          48,
          14,
          64,
          29
        ],
        "style": "long-gable",
        "raise": 0
      },
      {
        "name": "east-starseed-song-roof",
        "rect": [
          48,
          30,
          64,
          43
        ],
        "style": "double-hill",
        "raise": 1
      },
      {
        "name": "east-glacier-map-crest",
        "rect": [
          48,
          44,
          64,
          54
        ],
        "style": "step-front",
        "raise": 0
      },
      {
        "name": "east-guest-shingle",
        "rect": [
          48,
          55,
          64,
          68
        ],
        "style": "edge-rise",
        "raise": 2
      },
      {
        "name": "outer-aurora-lookout",
        "rect": [
          65,
          14,
          82,
          29
        ],
        "style": "long-gable",
        "raise": 0
      },
      {
        "name": "outer-snowbell-workshop",
        "rect": [
          65,
          30,
          82,
          43
        ],
        "style": "edge-rise",
        "raise": 2
      },
      {
        "name": "outer-winter-bath",
        "rect": [
          65,
          44,
          82,
          54
        ],
        "style": "double-hill",
        "raise": 1
      }
    ],
    "fixtures": [
      {
        "x": 39,
        "z": 5,
        "room": "north-starfall-vestibule",
        "asset": "pack4:064"
      },
      {
        "x": 44,
        "z": 10,
        "room": "north-starfall-vestibule",
        "asset": "pack4:059"
      },
      {
        "x": 38,
        "z": 18,
        "room": "north-pineglass-feast-hall",
        "asset": "pack4:059"
      },
      {
        "x": 44,
        "z": 25,
        "room": "north-pineglass-feast-hall",
        "asset": "pack4:058"
      },
      {
        "x": 37,
        "z": 30,
        "room": "central-open-aurora-well",
        "asset": "pack4:064"
      },
      {
        "x": 46,
        "z": 39,
        "room": "central-open-aurora-well",
        "asset": "pack4:057"
      },
      {
        "x": 39,
        "z": 46,
        "room": "south-emberwine-gallery",
        "asset": "pack4:059"
      },
      {
        "x": 44,
        "z": 51,
        "room": "south-emberwine-gallery",
        "asset": "pack4:058"
      },
      {
        "x": 39,
        "z": 58,
        "room": "south-hearthkeeper-commons",
        "asset": "pack4:064"
      },
      {
        "x": 44,
        "z": 64,
        "room": "south-hearthkeeper-commons",
        "asset": "pack4:057"
      },
      {
        "x": 28,
        "z": 5,
        "room": "west-icechart-library",
        "asset": "pack5:084"
      },
      {
        "x": 32,
        "z": 11,
        "room": "west-icechart-library",
        "asset": "pack4:058"
      },
      {
        "x": 28,
        "z": 17,
        "room": "west-frostsignal-belfry",
        "asset": "pack4:064"
      },
      {
        "x": 32,
        "z": 23,
        "room": "west-frostsignal-belfry",
        "asset": "pack4:059"
      },
      {
        "x": 23,
        "z": 30,
        "room": "west-ale-and-amber-parlor",
        "asset": "pack4:059"
      },
      {
        "x": 32,
        "z": 34,
        "room": "west-ale-and-amber-parlor",
        "asset": "pack4:058"
      },
      {
        "x": 23,
        "z": 44,
        "room": "west-cinder-kitchen",
        "asset": "pack4:057"
      },
      {
        "x": 32,
        "z": 48,
        "room": "west-cinder-kitchen",
        "asset": "pack4:064"
      },
      {
        "x": 25,
        "z": 59,
        "room": "west-warmstone-lodging",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 32,
        "z": 63,
        "room": "west-warmstone-lodging",
        "asset": "pack4:057"
      },
      {
        "x": 5,
        "z": 31,
        "room": "far-west-sled-menders-taproom",
        "asset": "pack4:059"
      },
      {
        "x": 16,
        "z": 38,
        "room": "far-west-sled-menders-taproom",
        "asset": "pack4:064"
      },
      {
        "x": 5,
        "z": 50,
        "room": "far-west-winter-festival-barn",
        "asset": "pack4:058"
      },
      {
        "x": 16,
        "z": 61,
        "room": "far-west-winter-festival-barn",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 51,
        "z": 5,
        "room": "east-icepetal-tearoom",
        "asset": "pack4:059"
      },
      {
        "x": 59,
        "z": 10,
        "room": "east-icepetal-tearoom",
        "asset": "pack4:058"
      },
      {
        "x": 52,
        "z": 18,
        "room": "east-hot-cider-arcade",
        "asset": "pack4:064"
      },
      {
        "x": 60,
        "z": 24,
        "room": "east-hot-cider-arcade",
        "asset": "pack4:059"
      },
      {
        "x": 51,
        "z": 33,
        "room": "east-starseed-songroom",
        "asset": "pack4:059"
      },
      {
        "x": 59,
        "z": 39,
        "room": "east-starseed-songroom",
        "asset": "pack4:058"
      },
      {
        "x": 51,
        "z": 47,
        "room": "east-glacier-map-parlor",
        "asset": "pack5:084"
      },
      {
        "x": 59,
        "z": 51,
        "room": "east-glacier-map-parlor",
        "asset": "pack4:057"
      },
      {
        "x": 52,
        "z": 59,
        "room": "east-quiet-guest-quarters",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 60,
        "z": 64,
        "room": "east-quiet-guest-quarters",
        "asset": "pack4:057"
      },
      {
        "x": 68,
        "z": 18,
        "room": "far-east-northern-lights-deck",
        "asset": "pack4:064"
      },
      {
        "x": 78,
        "z": 26,
        "room": "far-east-northern-lights-deck",
        "asset": "pack4:059"
      },
      {
        "x": 68,
        "z": 33,
        "room": "far-east-snowbell-workshop",
        "asset": "pack4:059"
      },
      {
        "x": 78,
        "z": 39,
        "room": "far-east-snowbell-workshop",
        "asset": "pack4:058"
      },
      {
        "x": 68,
        "z": 47,
        "room": "far-east-winter-bath-gallery",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 78,
        "z": 51,
        "room": "far-east-winter-bath-gallery",
        "asset": "pack4:057"
      }
    ],
    "posts": [
      38,
      46
    ],
    "detail": "Original snow tavern with three asymmetrically absent glacier pockets, twenty connected winter rooms, a source-grounded open 48-cell aurora court, twenty independent roof wings, true outdoor Pack4 windows and four Pack5 two-cell reserved beds. Source-only, not live placement, settlement, weather/collider, physical iPhone or save ABI approved."
  }
]);
export const ROADMAP_C_1A_WAVE30_TAVERN_IDS=Object.freeze(ROADMAP_C_1A_WAVE30_TAVERN_SPECS.map(s=>'r1:'+s.category+':'+s.biome+':'+s.size+':'+String(s.index).padStart(3,'0')));
export function getRoadmapC1ATavernsWave30(){return ROADMAP_C_1A_WAVE30_TAVERN_SPECS.map(compileM2ArchitecturalSpec);}
