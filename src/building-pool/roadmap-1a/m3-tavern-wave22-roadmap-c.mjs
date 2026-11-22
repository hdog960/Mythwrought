// MYTHWROUGHT Roadmap C Builder 1A Wave22: Stormglass Split-Ridge Tavern.
// Original explicit coordinate-authoring of mountain-large tavern #003.
// SOURCE-ONLY / UNREGISTERED. No settlements, world placement, schema saves,
// active production/PR history/automations, or final gameplay effects.
// Twin highland cliff cutouts and one southeast missing terrace, original Pack
// physical blocks, true source room/portal/courtyard geometry. Native acceptance pending.
import {compileM2ArchitecturalSpec} from './m2-originals.mjs';
export const ROADMAP_C_1A_WAVE22_TAVERN_SPECS=Object.freeze([
  {
    "category": "tavern",
    "biome": "mountain",
    "size": "large",
    "index": 3,
    "title": "Stormglass Split-Ridge Tavern",
    "w": 72,
    "d": 60,
    "plan": "stormglass-triple-missing-cliff-courts-split-observatory-taproom-stormwell-ring-original",
    "roof": "steep",
    "skin": "pack1:006",
    "roofAsset": "pack3:025",
    "exteriorNotches": [
      [
        0,
        0,
        17,
        16
      ],
      [
        55,
        0,
        71,
        13
      ],
      [
        57,
        43,
        71,
        59
      ]
    ],
    "segments": [
      [
        17,
        17,
        17,
        58
      ],
      [
        44,
        2,
        44,
        58
      ],
      [
        18,
        16,
        44,
        16
      ],
      [
        18,
        35,
        44,
        35
      ],
      [
        18,
        46,
        44,
        46
      ],
      [
        2,
        27,
        17,
        27
      ],
      [
        2,
        36,
        17,
        36
      ],
      [
        10,
        28,
        10,
        36
      ],
      [
        2,
        47,
        17,
        47
      ],
      [
        45,
        13,
        54,
        13
      ],
      [
        45,
        25,
        70,
        25
      ],
      [
        56,
        14,
        56,
        42
      ],
      [
        45,
        35,
        56,
        35
      ],
      [
        45,
        43,
        56,
        43
      ],
      [
        57,
        42,
        70,
        42
      ]
    ],
    "entry": [
      31,
      1,
      "north-thunder-entry"
    ],
    "rooms": [
      {
        "id": "north-thunder-entry",
        "min": [
          18,
          1,
          2
        ],
        "max": [
          44,
          4,
          16
        ]
      },
      {
        "id": "north-meteor-observatory",
        "min": [
          45,
          1,
          2
        ],
        "max": [
          54,
          4,
          13
        ]
      },
      {
        "id": "east-skybridge-map-parlor",
        "min": [
          45,
          1,
          14
        ],
        "max": [
          56,
          4,
          25
        ]
      },
      {
        "id": "east-stormglass-viewroom",
        "min": [
          57,
          1,
          14
        ],
        "max": [
          70,
          4,
          25
        ]
      },
      {
        "id": "east-furnace-taproom",
        "min": [
          45,
          1,
          26
        ],
        "max": [
          56,
          4,
          35
        ]
      },
      {
        "id": "east-cliff-singer-stage",
        "min": [
          57,
          1,
          26
        ],
        "max": [
          70,
          4,
          42
        ]
      },
      {
        "id": "east-steambath-gallery",
        "min": [
          45,
          1,
          36
        ],
        "max": [
          56,
          4,
          43
        ]
      },
      {
        "id": "east-watch-suites",
        "min": [
          45,
          1,
          44
        ],
        "max": [
          56,
          4,
          58
        ]
      },
      {
        "id": "west-firepit-kitchen",
        "min": [
          2,
          1,
          17
        ],
        "max": [
          17,
          4,
          27
        ]
      },
      {
        "id": "west-cask-cellar",
        "min": [
          2,
          1,
          28
        ],
        "max": [
          10,
          4,
          36
        ]
      },
      {
        "id": "west-forge-workbench",
        "min": [
          11,
          1,
          28
        ],
        "max": [
          17,
          4,
          36
        ]
      },
      {
        "id": "west-shearwind-bunks",
        "min": [
          2,
          1,
          37
        ],
        "max": [
          17,
          4,
          47
        ]
      },
      {
        "id": "west-clifftop-lodging",
        "min": [
          2,
          1,
          48
        ],
        "max": [
          17,
          4,
          58
        ]
      },
      {
        "id": "central-thunderhall",
        "min": [
          18,
          1,
          17
        ],
        "max": [
          44,
          4,
          35
        ]
      },
      {
        "id": "central-open-stormcourt",
        "min": [
          18,
          1,
          36
        ],
        "max": [
          44,
          4,
          46
        ]
      },
      {
        "id": "central-nightfeast-lounge",
        "min": [
          18,
          1,
          47
        ],
        "max": [
          44,
          4,
          58
        ]
      }
    ],
    "doors": [
      {
        "at": [
          31,
          1,
          16
        ],
        "from": "north-thunder-entry",
        "to": "central-thunderhall"
      },
      {
        "at": [
          44,
          1,
          8
        ],
        "from": "north-thunder-entry",
        "to": "north-meteor-observatory"
      },
      {
        "at": [
          49,
          1,
          13
        ],
        "from": "north-meteor-observatory",
        "to": "east-skybridge-map-parlor"
      },
      {
        "at": [
          44,
          1,
          20
        ],
        "from": "central-thunderhall",
        "to": "east-skybridge-map-parlor"
      },
      {
        "at": [
          56,
          1,
          18
        ],
        "from": "east-skybridge-map-parlor",
        "to": "east-stormglass-viewroom"
      },
      {
        "at": [
          44,
          1,
          30
        ],
        "from": "central-thunderhall",
        "to": "east-furnace-taproom"
      },
      {
        "at": [
          56,
          1,
          31
        ],
        "from": "east-furnace-taproom",
        "to": "east-cliff-singer-stage"
      },
      {
        "at": [
          44,
          1,
          40
        ],
        "from": "central-open-stormcourt",
        "to": "east-steambath-gallery"
      },
      {
        "at": [
          44,
          1,
          50
        ],
        "from": "central-nightfeast-lounge",
        "to": "east-watch-suites"
      },
      {
        "at": [
          49,
          1,
          43
        ],
        "from": "east-steambath-gallery",
        "to": "east-watch-suites"
      },
      {
        "at": [
          49,
          1,
          35
        ],
        "from": "east-furnace-taproom",
        "to": "east-steambath-gallery"
      },
      {
        "at": [
          56,
          1,
          40
        ],
        "from": "east-steambath-gallery",
        "to": "east-cliff-singer-stage"
      },
      {
        "at": [
          61,
          1,
          25
        ],
        "from": "east-stormglass-viewroom",
        "to": "east-cliff-singer-stage"
      },
      {
        "at": [
          49,
          1,
          25
        ],
        "from": "east-skybridge-map-parlor",
        "to": "east-furnace-taproom"
      },
      {
        "at": [
          17,
          1,
          22
        ],
        "from": "west-firepit-kitchen",
        "to": "central-thunderhall"
      },
      {
        "at": [
          17,
          1,
          33
        ],
        "from": "west-forge-workbench",
        "to": "central-thunderhall"
      },
      {
        "at": [
          17,
          1,
          41
        ],
        "from": "west-shearwind-bunks",
        "to": "central-open-stormcourt"
      },
      {
        "at": [
          17,
          1,
          53
        ],
        "from": "west-clifftop-lodging",
        "to": "central-nightfeast-lounge"
      },
      {
        "at": [
          7,
          1,
          27
        ],
        "from": "west-firepit-kitchen",
        "to": "west-cask-cellar"
      },
      {
        "at": [
          14,
          1,
          27
        ],
        "from": "west-firepit-kitchen",
        "to": "west-forge-workbench"
      },
      {
        "at": [
          10,
          1,
          32
        ],
        "from": "west-cask-cellar",
        "to": "west-forge-workbench"
      },
      {
        "at": [
          7,
          1,
          36
        ],
        "from": "west-cask-cellar",
        "to": "west-shearwind-bunks"
      },
      {
        "at": [
          14,
          1,
          36
        ],
        "from": "west-forge-workbench",
        "to": "west-shearwind-bunks"
      },
      {
        "at": [
          7,
          1,
          47
        ],
        "from": "west-shearwind-bunks",
        "to": "west-clifftop-lodging"
      },
      {
        "at": [
          30,
          1,
          35
        ],
        "from": "central-thunderhall",
        "to": "central-open-stormcourt"
      },
      {
        "at": [
          30,
          1,
          46
        ],
        "from": "central-open-stormcourt",
        "to": "central-nightfeast-lounge"
      },
      {
        "at": [
          44,
          1,
          14
        ],
        "from": "north-thunder-entry",
        "to": "east-skybridge-map-parlor"
      },
      {
        "at": [
          44,
          1,
          23
        ],
        "from": "central-thunderhall",
        "to": "east-skybridge-map-parlor"
      },
      {
        "at": [
          44,
          1,
          33
        ],
        "from": "central-thunderhall",
        "to": "east-furnace-taproom"
      },
      {
        "at": [
          56,
          1,
          22
        ],
        "from": "east-skybridge-map-parlor",
        "to": "east-stormglass-viewroom"
      },
      {
        "at": [
          56,
          1,
          34
        ],
        "from": "east-furnace-taproom",
        "to": "east-cliff-singer-stage"
      },
      {
        "at": [
          44,
          1,
          37
        ],
        "from": "central-open-stormcourt",
        "to": "east-steambath-gallery"
      },
      {
        "at": [
          44,
          1,
          47
        ],
        "from": "central-nightfeast-lounge",
        "to": "east-watch-suites"
      }
    ],
    "windows": [
      [
        22,
        1,
        "north"
      ],
      [
        33,
        1,
        "north"
      ],
      [
        42,
        1,
        "north"
      ],
      [
        48,
        1,
        "north"
      ],
      [
        18,
        8,
        "west"
      ],
      [
        54,
        8,
        "east"
      ],
      [
        1,
        21,
        "west"
      ],
      [
        1,
        31,
        "west"
      ],
      [
        1,
        41,
        "west"
      ],
      [
        1,
        51,
        "west"
      ],
      [
        70,
        18,
        "east"
      ],
      [
        70,
        31,
        "east"
      ],
      [
        70,
        38,
        "east"
      ],
      [
        56,
        49,
        "east"
      ],
      [
        56,
        54,
        "east"
      ],
      [
        23,
        58,
        "south"
      ],
      [
        34,
        58,
        "south"
      ],
      [
        51,
        58,
        "south"
      ]
    ],
    "fixtures": [
      {
        "x": 24,
        "z": 7,
        "room": "north-thunder-entry",
        "asset": "pack4:059"
      },
      {
        "x": 37,
        "z": 7,
        "room": "north-thunder-entry",
        "asset": "pack4:058"
      },
      {
        "x": 48,
        "z": 6,
        "room": "north-meteor-observatory",
        "asset": "pack4:059"
      },
      {
        "x": 48,
        "z": 19,
        "room": "east-skybridge-map-parlor",
        "asset": "pack4:058"
      },
      {
        "x": 61,
        "z": 19,
        "room": "east-stormglass-viewroom",
        "asset": "pack4:059"
      },
      {
        "x": 48,
        "z": 29,
        "room": "east-furnace-taproom",
        "asset": "pack4:064"
      },
      {
        "x": 62,
        "z": 31,
        "room": "east-cliff-singer-stage",
        "asset": "pack4:059"
      },
      {
        "x": 48,
        "z": 40,
        "room": "east-steambath-gallery",
        "asset": "pack4:057"
      },
      {
        "x": 47,
        "z": 49,
        "room": "east-watch-suites",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 52,
        "z": 49,
        "room": "east-watch-suites",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 47,
        "z": 54,
        "room": "east-watch-suites",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 52,
        "z": 54,
        "room": "east-watch-suites",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 6,
        "z": 21,
        "room": "west-firepit-kitchen",
        "asset": "pack4:064"
      },
      {
        "x": 6,
        "z": 32,
        "room": "west-cask-cellar",
        "asset": "pack5:084"
      },
      {
        "x": 13,
        "z": 32,
        "room": "west-forge-workbench",
        "asset": "pack4:058"
      },
      {
        "x": 6,
        "z": 41,
        "room": "west-shearwind-bunks",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 12,
        "z": 41,
        "room": "west-shearwind-bunks",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 7,
        "z": 52,
        "room": "west-clifftop-lodging",
        "asset": "pack4:059"
      },
      {
        "x": 22,
        "z": 22,
        "room": "central-thunderhall",
        "asset": "pack4:064"
      },
      {
        "x": 37,
        "z": 27,
        "room": "central-thunderhall",
        "asset": "pack4:059"
      },
      {
        "x": 22,
        "z": 40,
        "room": "central-open-stormcourt",
        "asset": "pack4:059"
      },
      {
        "x": 22,
        "z": 51,
        "room": "central-nightfeast-lounge",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 29,
        "z": 51,
        "room": "central-nightfeast-lounge",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 38,
        "z": 52,
        "room": "central-nightfeast-lounge",
        "asset": "pack4:059"
      }
    ],
    "roofWings": [
      {
        "name": "north-thunder-entry-split-pitch",
        "rect": [
          18,
          0,
          44,
          16
        ],
        "style": "double-hill",
        "raise": 2
      },
      {
        "name": "meteor-observatory-slate-spire",
        "rect": [
          45,
          0,
          54,
          13
        ],
        "style": "long-gable",
        "raise": 2
      },
      {
        "name": "skybridge-map-hall-arch",
        "rect": [
          45,
          14,
          56,
          25
        ],
        "style": "step-front",
        "raise": 2
      },
      {
        "name": "stormglass-viewroom-steeple",
        "rect": [
          57,
          14,
          70,
          25
        ],
        "style": "long-gable",
        "raise": 2
      },
      {
        "name": "furnace-taproom-crosspitch",
        "rect": [
          45,
          26,
          56,
          35
        ],
        "style": "double-hill",
        "raise": 1
      },
      {
        "name": "cliff-singer-stage-cantilever",
        "rect": [
          57,
          26,
          71,
          42
        ],
        "style": "step-front",
        "raise": 2
      },
      {
        "name": "steambath-gallery-stonecap",
        "rect": [
          45,
          36,
          56,
          43
        ],
        "style": "edge-rise",
        "raise": 1
      },
      {
        "name": "east-watch-suites-watchridge",
        "rect": [
          45,
          44,
          56,
          59
        ],
        "style": "long-gable",
        "raise": 2
      },
      {
        "name": "west-kitchen-chimney-pitch",
        "rect": [
          0,
          17,
          17,
          27
        ],
        "style": "long-gable",
        "raise": 2
      },
      {
        "name": "west-cellar-protection-hip",
        "rect": [
          0,
          28,
          10,
          36
        ],
        "style": "double-hill",
        "raise": 1
      },
      {
        "name": "west-ore-workbench-gable",
        "rect": [
          11,
          28,
          17,
          36
        ],
        "style": "step-front",
        "raise": 1
      },
      {
        "name": "west-bunkhouse-snowguard",
        "rect": [
          0,
          37,
          17,
          47
        ],
        "style": "double-hill",
        "raise": 2
      },
      {
        "name": "west-clifftop-lodging-roof",
        "rect": [
          0,
          48,
          17,
          59
        ],
        "style": "long-gable",
        "raise": 2
      },
      {
        "name": "central-thunderhall-stormridge",
        "rect": [
          18,
          17,
          44,
          35
        ],
        "style": "double-hill",
        "raise": 2
      },
      {
        "name": "central-open-stormcourt-perimeter",
        "rect": [
          18,
          36,
          44,
          46
        ],
        "style": "step-front",
        "raise": 1
      },
      {
        "name": "south-nightfeast-longcloak",
        "rect": [
          18,
          47,
          44,
          59
        ],
        "style": "long-gable",
        "raise": 2
      }
    ],
    "courtyard": [
      27,
      37,
      36,
      44
    ],
    "posts": [
      23,
      37
    ],
    "detail": "Source-only original mountain tavern with split-ridge observatory, dining/bar/stage wings, stormwell courtyard, triple real cliffside missing courtyards, twenty-foot room connections, sixteen pitched roofs, eight original double-cell guest bunks, and enchanted-looking stormglass vista, without world placement, settlement automation, schema or save writes."
  }
]);
export const ROADMAP_C_1A_WAVE22_TAVERN_IDS=Object.freeze(ROADMAP_C_1A_WAVE22_TAVERN_SPECS.map(s=>'r1:'+s.category+':'+s.biome+':'+s.size+':'+String(s.index).padStart(3,'0')));
export function getRoadmapC1ATavernWave22(){return ROADMAP_C_1A_WAVE22_TAVERN_SPECS.map(compileM2ArchitecturalSpec);}
