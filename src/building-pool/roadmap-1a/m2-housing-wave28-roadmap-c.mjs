// MYTHWROUGHT Roadmap C Builder 1A #651 Wave28: Dunebell Three-Crescent Oasis Manor.
// Original desert LARGE house 020, isolated author-only source, no runtime registration.
// Three genuine absent desert-crescent volumes; independent 64-cell grounded sky-open oasis.
// Nineteen connected real rooms, 33 real two-high portals, 28 oriented Pack4 windows,
// nineteen backed source roof wings and four reserved genuine Pack5 two-cell beds.
// No settlement/world placement, schema/v0.11/saves, production main or other dev edits.
import {compileM2ArchitecturalSpec} from './m2-originals.mjs';
export const ROADMAP_C_1A_WAVE28_HOUSE_SPECS=Object.freeze(  [
    {
      "category": "house",
      "biome": "desert",
      "size": "large",
      "index": 20,
      "title": "Dunebell Three-Crescent Oasis Manor",
      "w": 80,
      "d": 70,
      "plan": "three-unequal-desert-crescent-voids-with-new-western-walled-sunwind-promenade-and-shaded-oasis",
      "roof": "hip",
      "skin": "pack1:006",
      "roofAsset": "pack3:023",
      "exteriorNotches": [
        [
          0,
          0,
          9,
          23
        ],
        [
          60,
          0,
          79,
          20
        ],
        [
          56,
          51,
          79,
          69
        ]
      ],
      "segments": [
        [
          29,
          2,
          29,
          68
        ],
        [
          46,
          2,
          46,
          68
        ],
        [
          60,
          21,
          60,
          50
        ],
        [
          30,
          18,
          45,
          18
        ],
        [
          30,
          30,
          45,
          30
        ],
        [
          30,
          42,
          45,
          42
        ],
        [
          30,
          53,
          45,
          53
        ],
        [
          24,
          15,
          28,
          15
        ],
        [
          24,
          24,
          28,
          24
        ],
        [
          2,
          38,
          28,
          38
        ],
        [
          2,
          50,
          28,
          50
        ],
        [
          15,
          51,
          15,
          68
        ],
        [
          47,
          20,
          59,
          20
        ],
        [
          47,
          36,
          59,
          36
        ],
        [
          47,
          53,
          55,
          53
        ],
        [
          61,
          33,
          78,
          33
        ],
        [
          61,
          44,
          78,
          44
        ],
        [
          23,
          2,
          23,
          22
        ]
      ],
      "entry": [
        38,
        1,
        "sunshade-entry"
      ],
      "doors": [
        {
          "at": [
            29,
            1,
            8
          ],
          "from": "sunshade-entry",
          "to": "west-windwatch"
        },
        {
          "at": [
            26,
            1,
            15
          ],
          "from": "west-windwatch",
          "to": "west-sandlotus-niche"
        },
        {
          "at": [
            26,
            1,
            24
          ],
          "from": "west-sandlotus-niche",
          "to": "west-ceramic-mosaic"
        },
        {
          "at": [
            15,
            1,
            38
          ],
          "from": "west-ceramic-mosaic",
          "to": "west-terrace-breadhouse"
        },
        {
          "at": [
            8,
            1,
            50
          ],
          "from": "west-terrace-breadhouse",
          "to": "west-sandstone-archive"
        },
        {
          "at": [
            22,
            1,
            50
          ],
          "from": "west-terrace-breadhouse",
          "to": "west-oasis-guest-room"
        },
        {
          "at": [
            15,
            1,
            60
          ],
          "from": "west-sandstone-archive",
          "to": "west-oasis-guest-room"
        },
        {
          "at": [
            29,
            1,
            27
          ],
          "from": "sundial-cross-gallery",
          "to": "west-ceramic-mosaic"
        },
        {
          "at": [
            29,
            1,
            34
          ],
          "from": "oasis-reflection-court",
          "to": "west-ceramic-mosaic"
        },
        {
          "at": [
            29,
            1,
            40
          ],
          "from": "oasis-reflection-court",
          "to": "west-terrace-breadhouse"
        },
        {
          "at": [
            29,
            1,
            47
          ],
          "from": "amber-hearth-dining",
          "to": "west-terrace-breadhouse"
        },
        {
          "at": [
            29,
            1,
            61
          ],
          "from": "south-lantern-sleeping",
          "to": "west-oasis-guest-room"
        },
        {
          "at": [
            38,
            1,
            18
          ],
          "from": "sunshade-entry",
          "to": "sundial-cross-gallery"
        },
        {
          "at": [
            38,
            1,
            30
          ],
          "from": "sundial-cross-gallery",
          "to": "oasis-reflection-court"
        },
        {
          "at": [
            38,
            1,
            42
          ],
          "from": "oasis-reflection-court",
          "to": "amber-hearth-dining"
        },
        {
          "at": [
            38,
            1,
            53
          ],
          "from": "amber-hearth-dining",
          "to": "south-lantern-sleeping"
        },
        {
          "at": [
            46,
            1,
            10
          ],
          "from": "sunshade-entry",
          "to": "east-sunroof-observatory"
        },
        {
          "at": [
            46,
            1,
            25
          ],
          "from": "sundial-cross-gallery",
          "to": "east-bazaar-kitchen"
        },
        {
          "at": [
            46,
            1,
            32
          ],
          "from": "oasis-reflection-court",
          "to": "east-bazaar-kitchen"
        },
        {
          "at": [
            46,
            1,
            38
          ],
          "from": "oasis-reflection-court",
          "to": "east-glass-artisan"
        },
        {
          "at": [
            46,
            1,
            47
          ],
          "from": "amber-hearth-dining",
          "to": "east-glass-artisan"
        },
        {
          "at": [
            46,
            1,
            60
          ],
          "from": "south-lantern-sleeping",
          "to": "east-healing-garden"
        },
        {
          "at": [
            53,
            1,
            20
          ],
          "from": "east-sunroof-observatory",
          "to": "east-bazaar-kitchen"
        },
        {
          "at": [
            53,
            1,
            36
          ],
          "from": "east-bazaar-kitchen",
          "to": "east-glass-artisan"
        },
        {
          "at": [
            51,
            1,
            53
          ],
          "from": "east-glass-artisan",
          "to": "east-healing-garden"
        },
        {
          "at": [
            60,
            1,
            27
          ],
          "from": "east-bazaar-kitchen",
          "to": "outer-east-lotus-atrium"
        },
        {
          "at": [
            68,
            1,
            33
          ],
          "from": "outer-east-lotus-atrium",
          "to": "outer-east-clay-press"
        },
        {
          "at": [
            68,
            1,
            44
          ],
          "from": "outer-east-clay-press",
          "to": "outer-east-cartographer"
        },
        {
          "at": [
            60,
            1,
            40
          ],
          "from": "east-glass-artisan",
          "to": "outer-east-clay-press"
        },
        {
          "at": [
            60,
            1,
            47
          ],
          "from": "east-glass-artisan",
          "to": "outer-east-cartographer"
        },
        {
          "at": [
            23,
            1,
            10
          ],
          "from": "west-windwatch",
          "to": "west-solar-wind-promenade"
        },
        {
          "at": [
            23,
            1,
            20
          ],
          "from": "west-sandlotus-niche",
          "to": "west-solar-wind-promenade"
        }
      ],
      "rooms": [
        {
          "id": "sunshade-entry",
          "min": [
            30,
            1,
            2
          ],
          "max": [
            46,
            4,
            18
          ]
        },
        {
          "id": "sundial-cross-gallery",
          "min": [
            30,
            1,
            19
          ],
          "max": [
            46,
            4,
            30
          ]
        },
        {
          "id": "oasis-reflection-court",
          "min": [
            30,
            1,
            31
          ],
          "max": [
            46,
            4,
            42
          ]
        },
        {
          "id": "amber-hearth-dining",
          "min": [
            30,
            1,
            43
          ],
          "max": [
            46,
            4,
            53
          ]
        },
        {
          "id": "south-lantern-sleeping",
          "min": [
            30,
            1,
            54
          ],
          "max": [
            46,
            4,
            69
          ]
        },
        {
          "id": "west-windwatch",
          "min": [
            24,
            1,
            2
          ],
          "max": [
            29,
            4,
            15
          ]
        },
        {
          "id": "west-sandlotus-niche",
          "min": [
            24,
            1,
            16
          ],
          "max": [
            29,
            4,
            24
          ]
        },
        {
          "id": "west-ceramic-mosaic",
          "min": [
            2,
            1,
            25
          ],
          "max": [
            29,
            4,
            38
          ]
        },
        {
          "id": "west-terrace-breadhouse",
          "min": [
            2,
            1,
            39
          ],
          "max": [
            29,
            4,
            50
          ]
        },
        {
          "id": "west-sandstone-archive",
          "min": [
            2,
            1,
            51
          ],
          "max": [
            15,
            4,
            69
          ]
        },
        {
          "id": "east-sunroof-observatory",
          "min": [
            47,
            1,
            2
          ],
          "max": [
            60,
            4,
            20
          ]
        },
        {
          "id": "east-bazaar-kitchen",
          "min": [
            47,
            1,
            21
          ],
          "max": [
            60,
            4,
            36
          ]
        },
        {
          "id": "east-glass-artisan",
          "min": [
            47,
            1,
            37
          ],
          "max": [
            60,
            4,
            53
          ]
        },
        {
          "id": "east-healing-garden",
          "min": [
            47,
            1,
            54
          ],
          "max": [
            56,
            4,
            69
          ]
        },
        {
          "id": "outer-east-lotus-atrium",
          "min": [
            61,
            1,
            22
          ],
          "max": [
            79,
            4,
            33
          ]
        },
        {
          "id": "outer-east-clay-press",
          "min": [
            61,
            1,
            34
          ],
          "max": [
            79,
            4,
            44
          ]
        },
        {
          "id": "outer-east-cartographer",
          "min": [
            61,
            1,
            45
          ],
          "max": [
            79,
            4,
            51
          ]
        },
        {
          "id": "west-oasis-guest-room",
          "min": [
            16,
            1,
            51
          ],
          "max": [
            29,
            4,
            69
          ]
        },
        {
          "id": "west-solar-wind-promenade",
          "min": [
            11,
            1,
            2
          ],
          "max": [
            23,
            4,
            23
          ]
        }
      ],
      "windows": [
        [
          26,
          1,
          "north"
        ],
        [
          34,
          1,
          "north"
        ],
        [
          42,
          1,
          "north"
        ],
        [
          53,
          1,
          "north"
        ],
        [
          10,
          9,
          "west"
        ],
        [
          10,
          20,
          "west"
        ],
        [
          6,
          24,
          "north"
        ],
        [
          8,
          24,
          "north"
        ],
        [
          1,
          28,
          "west"
        ],
        [
          1,
          35,
          "west"
        ],
        [
          1,
          43,
          "west"
        ],
        [
          1,
          47,
          "west"
        ],
        [
          1,
          58,
          "west"
        ],
        [
          1,
          64,
          "west"
        ],
        [
          12,
          68,
          "south"
        ],
        [
          22,
          68,
          "south"
        ],
        [
          34,
          68,
          "south"
        ],
        [
          42,
          68,
          "south"
        ],
        [
          51,
          68,
          "south"
        ],
        [
          59,
          7,
          "east"
        ],
        [
          59,
          15,
          "east"
        ],
        [
          65,
          21,
          "north"
        ],
        [
          72,
          21,
          "north"
        ],
        [
          78,
          28,
          "east"
        ],
        [
          78,
          38,
          "east"
        ],
        [
          78,
          48,
          "east"
        ],
        [
          55,
          58,
          "east"
        ],
        [
          55,
          64,
          "east"
        ]
      ],
      "courtyard": [
        34,
        34,
        41,
        41
      ],
      "roofWings": [
        {
          "name": "western-solar-wind-promenade-shade",
          "rect": [
            10,
            0,
            23,
            23
          ],
          "style": "long-gable",
          "raise": 2
        },
        {
          "name": "dune-windwatch-northern-shade",
          "rect": [
            24,
            0,
            29,
            17
          ],
          "style": "long-gable",
          "raise": 2
        },
        {
          "name": "sandlotus-observation-arc",
          "rect": [
            21,
            18,
            29,
            34
          ],
          "style": "edge-rise",
          "raise": 1
        },
        {
          "name": "western-firing-kiln-vault",
          "rect": [
            0,
            24,
            29,
            37
          ],
          "style": "double-hill",
          "raise": 2
        },
        {
          "name": "shaded-breadhouse-terrace",
          "rect": [
            0,
            38,
            29,
            49
          ],
          "style": "step-front",
          "raise": 1
        },
        {
          "name": "southern-archive-library-gable",
          "rect": [
            0,
            50,
            15,
            69
          ],
          "style": "long-gable",
          "raise": 2
        },
        {
          "name": "west-guest-shaded-sleep",
          "rect": [
            16,
            50,
            29,
            69
          ],
          "style": "edge-rise",
          "raise": 1
        },
        {
          "name": "central-sundial-brass-entry",
          "rect": [
            29,
            0,
            46,
            17
          ],
          "style": "double-hill",
          "raise": 1
        },
        {
          "name": "sundial-cross-gallery-ridge",
          "rect": [
            29,
            18,
            46,
            29
          ],
          "style": "long-gable",
          "raise": 2
        },
        {
          "name": "oasis-reflection-ring",
          "rect": [
            29,
            30,
            46,
            42
          ],
          "style": "step-front",
          "raise": 1
        },
        {
          "name": "central-dining-hearth-bell",
          "rect": [
            29,
            43,
            46,
            52
          ],
          "style": "double-hill",
          "raise": 2
        },
        {
          "name": "south-lantern-house-roof",
          "rect": [
            29,
            53,
            46,
            69
          ],
          "style": "long-gable",
          "raise": 1
        },
        {
          "name": "sunroof-glass-surveyor",
          "rect": [
            47,
            0,
            59,
            20
          ],
          "style": "edge-rise",
          "raise": 1
        },
        {
          "name": "bazaar-tamarind-kitchen",
          "rect": [
            47,
            21,
            60,
            35
          ],
          "style": "step-front",
          "raise": 2
        },
        {
          "name": "artisan-mirrorwork-gable",
          "rect": [
            47,
            36,
            60,
            52
          ],
          "style": "long-gable",
          "raise": 1
        },
        {
          "name": "east-healing-aloe-shade",
          "rect": [
            47,
            53,
            55,
            69
          ],
          "style": "double-hill",
          "raise": 2
        },
        {
          "name": "far-east-waterlotus-atrium",
          "rect": [
            61,
            21,
            79,
            32
          ],
          "style": "long-gable",
          "raise": 1
        },
        {
          "name": "far-east-claypress-roof",
          "rect": [
            61,
            33,
            79,
            43
          ],
          "style": "edge-rise",
          "raise": 2
        },
        {
          "name": "far-east-cartography-ridge",
          "rect": [
            61,
            44,
            79,
            50
          ],
          "style": "step-front",
          "raise": 1
        }
      ],
      "fixtures": [
        {
          "x": 34,
          "z": 7,
          "room": "sunshade-entry",
          "asset": "pack4:059"
        },
        {
          "x": 43,
          "z": 14,
          "room": "sunshade-entry",
          "asset": "pack4:064"
        },
        {
          "x": 33,
          "z": 23,
          "room": "sundial-cross-gallery",
          "asset": "pack4:059"
        },
        {
          "x": 42,
          "z": 26,
          "room": "sundial-cross-gallery",
          "asset": "pack5:084"
        },
        {
          "x": 32,
          "z": 33,
          "room": "oasis-reflection-court",
          "asset": "pack4:058"
        },
        {
          "x": 43,
          "z": 41,
          "room": "oasis-reflection-court",
          "asset": "pack4:059"
        },
        {
          "x": 33,
          "z": 46,
          "room": "amber-hearth-dining",
          "asset": "pack4:064"
        },
        {
          "x": 42,
          "z": 50,
          "room": "amber-hearth-dining",
          "asset": "pack4:057"
        },
        {
          "x": 34,
          "z": 60,
          "room": "south-lantern-sleeping",
          "asset": "pack5:082",
          "variant": "wanderer-quilt"
        },
        {
          "x": 42,
          "z": 64,
          "room": "south-lantern-sleeping",
          "asset": "pack4:058"
        },
        {
          "x": 25,
          "z": 7,
          "room": "west-windwatch",
          "asset": "pack5:084"
        },
        {
          "x": 27,
          "z": 12,
          "room": "west-windwatch",
          "asset": "pack4:059"
        },
        {
          "x": 25,
          "z": 18,
          "room": "west-sandlotus-niche",
          "asset": "pack4:058"
        },
        {
          "x": 27,
          "z": 21,
          "room": "west-sandlotus-niche",
          "asset": "pack4:057"
        },
        {
          "x": 5,
          "z": 28,
          "room": "west-ceramic-mosaic",
          "asset": "pack4:064"
        },
        {
          "x": 23,
          "z": 33,
          "room": "west-ceramic-mosaic",
          "asset": "pack4:058"
        },
        {
          "x": 7,
          "z": 42,
          "room": "west-terrace-breadhouse",
          "asset": "pack4:057"
        },
        {
          "x": 23,
          "z": 46,
          "room": "west-terrace-breadhouse",
          "asset": "pack4:064"
        },
        {
          "x": 8,
          "z": 58,
          "room": "west-sandstone-archive",
          "asset": "pack5:082",
          "variant": "wanderer-quilt"
        },
        {
          "x": 11,
          "z": 64,
          "room": "west-sandstone-archive",
          "asset": "pack4:059"
        },
        {
          "x": 50,
          "z": 7,
          "room": "east-sunroof-observatory",
          "asset": "pack4:059"
        },
        {
          "x": 57,
          "z": 16,
          "room": "east-sunroof-observatory",
          "asset": "pack5:084"
        },
        {
          "x": 49,
          "z": 24,
          "room": "east-bazaar-kitchen",
          "asset": "pack4:064"
        },
        {
          "x": 57,
          "z": 33,
          "room": "east-bazaar-kitchen",
          "asset": "pack4:057"
        },
        {
          "x": 50,
          "z": 40,
          "room": "east-glass-artisan",
          "asset": "pack5:084"
        },
        {
          "x": 56,
          "z": 49,
          "room": "east-glass-artisan",
          "asset": "pack4:058"
        },
        {
          "x": 50,
          "z": 60,
          "room": "east-healing-garden",
          "asset": "pack5:082",
          "variant": "wanderer-quilt"
        },
        {
          "x": 53,
          "z": 65,
          "room": "east-healing-garden",
          "asset": "pack4:059"
        },
        {
          "x": 64,
          "z": 25,
          "room": "outer-east-lotus-atrium",
          "asset": "pack4:064"
        },
        {
          "x": 75,
          "z": 29,
          "room": "outer-east-lotus-atrium",
          "asset": "pack4:058"
        },
        {
          "x": 64,
          "z": 37,
          "room": "outer-east-clay-press",
          "asset": "pack4:059"
        },
        {
          "x": 75,
          "z": 41,
          "room": "outer-east-clay-press",
          "asset": "pack5:084"
        },
        {
          "x": 64,
          "z": 47,
          "room": "outer-east-cartographer",
          "asset": "pack5:084"
        },
        {
          "x": 74,
          "z": 49,
          "room": "outer-east-cartographer",
          "asset": "pack4:057"
        },
        {
          "x": 20,
          "z": 60,
          "room": "west-oasis-guest-room",
          "asset": "pack5:082",
          "variant": "wanderer-quilt"
        },
        {
          "x": 25,
          "z": 65,
          "room": "west-oasis-guest-room",
          "asset": "pack4:059"
        },
        {
          "x": 39,
          "z": 49,
          "room": "amber-hearth-dining",
          "asset": "pack4:058"
        },
        {
          "x": 9,
          "z": 33,
          "room": "west-ceramic-mosaic",
          "asset": "pack5:084"
        },
        {
          "x": 52,
          "z": 28,
          "room": "east-bazaar-kitchen",
          "asset": "pack4:058"
        },
        {
          "x": 69,
          "z": 29,
          "room": "outer-east-lotus-atrium",
          "asset": "pack4:059"
        },
        {
          "x": 13,
          "z": 7,
          "room": "west-solar-wind-promenade",
          "asset": "pack4:064"
        },
        {
          "x": 20,
          "z": 17,
          "room": "west-solar-wind-promenade",
          "asset": "pack4:059"
        }
      ],
      "posts": [
        31,
        44
      ],
      "detail": "Original Dunebell desert large home has a narrow genuine fully absent northwest dune cutout, two further real void bays, a new separately walled and dual-door-connected 12-cell-wide west solar-wind promenade, a central 64-cell grounded open-air oasis, nineteen real reachable connected family/craft rooms, thirty-three two-high source portals, twenty-eight outward authentic Pack4 windows, nineteen independently backed original Pack3 roofs, original carved Pack1 stone and four true Pack5 two-cell guest bed reservations. No live runtime world placement, settlement, load/weather or game-collider, save ABI, physical iPhone or final texture certification."
    }
  ]);
export const ROADMAP_C_1A_WAVE28_HOUSE_IDS=Object.freeze(ROADMAP_C_1A_WAVE28_HOUSE_SPECS.map(x=>'r1:'+x.category+':'+x.biome+':'+x.size+':'+String(x.index).padStart(3,'0')));
export function getRoadmapC1AHousesWave28(){return ROADMAP_C_1A_WAVE28_HOUSE_SPECS.map(compileM2ArchitecturalSpec);}
