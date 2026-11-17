// 4B M2: final fifth-variant 15 independently authored healing buildings. No runtime integration.
import {M2_123_ALL} from './m2-variant04-final10.mjs';
import {buildDistinctive4B} from './m2-distinctive.mjs';
import {validateCollection,geometrySignature} from './schema.mjs';
const PLANS=Object.freeze([
  {
    "t": "healers-house",
    "b": "temperate",
    "s": "small",
    "variant": 5,
    "title": "Harborbloom Angled Ward Cottage",
    "dim": [
      34,
      13,
      34
    ],
    "r": [
      [
        12,
        20,
        1,
        31
      ],
      [
        3,
        14,
        7,
        16
      ],
      [
        20,
        30,
        16,
        27
      ],
      [
        5,
        13,
        25,
        31
      ],
      [
        20,
        28,
        7,
        12
      ]
    ],
    "e": [
      16,
      1
    ],
    "rooms": [
      [
        "waiting",
        16,
        5
      ],
      [
        "treatment",
        7,
        12
      ],
      [
        "recovery",
        25,
        21
      ],
      [
        "herbal-ward",
        8,
        28
      ],
      [
        "consultation",
        16,
        25
      ]
    ],
    "div": [
      [
        "x",
        20,
        17,
        25,
        21
      ]
    ],
    "peak": [
      [
        7,
        12
      ],
      [
        25,
        21
      ],
      [
        8,
        28
      ],
      [
        24,
        9
      ]
    ],
    "roof": "harborbloom-offset-cottage-hips"
  },
  {
    "t": "healers-house",
    "b": "temperate",
    "s": "medium",
    "variant": 5,
    "title": "Weirbank Twin-Bastion Healthhouse",
    "dim": [
      44,
      15,
      41
    ],
    "r": [
      [
        18,
        26,
        1,
        37
      ],
      [
        3,
        20,
        9,
        21
      ],
      [
        25,
        41,
        16,
        30
      ],
      [
        9,
        36,
        35,
        39
      ]
    ],
    "discs": [
      [
        9,
        14,
        7,
        6
      ],
      [
        35,
        24,
        6,
        6
      ]
    ],
    "e": [
      22,
      1
    ],
    "rooms": [
      [
        "waiting",
        22,
        5
      ],
      [
        "treatment",
        9,
        14
      ],
      [
        "recovery",
        35,
        24
      ],
      [
        "physician-study",
        22,
        23
      ],
      [
        "remedy-stores",
        16,
        36
      ],
      [
        "rehabilitation",
        31,
        36
      ]
    ],
    "div": [
      [
        "x",
        25,
        15,
        23,
        19
      ]
    ],
    "peak": [
      [
        9,
        14
      ],
      [
        35,
        24
      ],
      [
        16,
        36
      ],
      [
        31,
        36
      ]
    ],
    "roof": "weirbank-twin-high-bastion-roofs"
  },
  {
    "t": "healers-house",
    "b": "temperate",
    "s": "large",
    "variant": 5,
    "title": "Glenmere Open-Ring Recovery Abbey",
    "dim": [
      54,
      17,
      49
    ],
    "r": [
      [
        5,
        48,
        9,
        44
      ],
      [
        21,
        30,
        1,
        13
      ]
    ],
    "holes": [
      [
        26,
        27,
        7,
        6
      ]
    ],
    "discs": [
      [
        10,
        15,
        6,
        6
      ],
      [
        44,
        38,
        6,
        6
      ]
    ],
    "e": [
      25,
      1
    ],
    "rooms": [
      [
        "waiting",
        25,
        5
      ],
      [
        "treatment",
        12,
        16
      ],
      [
        "recovery",
        42,
        17
      ],
      [
        "quarantine",
        12,
        38
      ],
      [
        "herb-distillery",
        42,
        37
      ],
      [
        "sunroom",
        25,
        40
      ],
      [
        "physician-council",
        25,
        17
      ]
    ],
    "div": [
      [
        "z",
        14,
        14,
        39,
        18
      ]
    ],
    "peak": [
      [
        12,
        16
      ],
      [
        42,
        17
      ],
      [
        12,
        38
      ],
      [
        42,
        38
      ]
    ],
    "roof": "glenmere-open-garden-abby-canopies"
  },
  {
    "t": "healers-house",
    "b": "desert",
    "s": "small",
    "variant": 5,
    "title": "Dustwisp Crescent Oasis Medic",
    "dim": [
      34,
      13,
      33
    ],
    "r": [
      [
        13,
        20,
        1,
        30
      ],
      [
        3,
        14,
        8,
        18
      ],
      [
        20,
        30,
        18,
        28
      ]
    ],
    "discs": [
      [
        8,
        12,
        6,
        6
      ],
      [
        27,
        22,
        5,
        5
      ]
    ],
    "holes": [
      [
        27,
        22,
        1,
        1
      ]
    ],
    "e": [
      16,
      1
    ],
    "rooms": [
      [
        "waiting",
        16,
        5
      ],
      [
        "treatment",
        8,
        12
      ],
      [
        "recovery",
        25,
        23
      ],
      [
        "cooling-supplies",
        17,
        27
      ]
    ],
    "div": [
      [
        "z",
        18,
        13,
        22,
        17
      ]
    ],
    "peak": [
      [
        8,
        12
      ],
      [
        26,
        23
      ],
      [
        17,
        26
      ]
    ],
    "roof": "dustwisp-crescent-slatted-vaults"
  },
  {
    "t": "healers-house",
    "b": "desert",
    "s": "medium",
    "variant": 5,
    "title": "Saffronblade Sunshade Infirmary",
    "dim": [
      45,
      15,
      41
    ],
    "r": [
      [
        18,
        25,
        1,
        38
      ],
      [
        3,
        19,
        7,
        17
      ],
      [
        25,
        41,
        19,
        33
      ],
      [
        8,
        28,
        35,
        39
      ]
    ],
    "discs": [
      [
        35,
        25,
        6,
        6
      ]
    ],
    "holes": [
      [
        35,
        24,
        1,
        1
      ]
    ],
    "e": [
      22,
      1
    ],
    "rooms": [
      [
        "waiting",
        22,
        5
      ],
      [
        "treatment",
        9,
        13
      ],
      [
        "recovery",
        36,
        26
      ],
      [
        "shade-vault",
        18,
        37
      ],
      [
        "physician-desk",
        22,
        23
      ]
    ],
    "div": [
      [
        "x",
        25,
        17,
        27,
        21
      ]
    ],
    "peak": [
      [
        9,
        13
      ],
      [
        35,
        25
      ],
      [
        18,
        36
      ]
    ],
    "roof": "saffronblade-crosswind-high-and-low-roofs"
  },
  {
    "t": "healers-house",
    "b": "desert",
    "s": "large",
    "variant": 5,
    "title": "Mirage Gate Four-Court Sanatorium",
    "dim": [
      55,
      17,
      49
    ],
    "r": [
      [
        22,
        30,
        1,
        46
      ],
      [
        4,
        23,
        9,
        21
      ],
      [
        30,
        51,
        9,
        23
      ],
      [
        6,
        23,
        33,
        45
      ],
      [
        29,
        50,
        31,
        45
      ]
    ],
    "holes": [
      [
        15,
        15,
        2,
        2
      ],
      [
        39,
        37,
        2,
        2
      ]
    ],
    "e": [
      26,
      1
    ],
    "rooms": [
      [
        "waiting",
        26,
        5
      ],
      [
        "treatment",
        10,
        15
      ],
      [
        "recovery",
        41,
        15
      ],
      [
        "water-lab",
        13,
        39
      ],
      [
        "isolation",
        41,
        39
      ],
      [
        "council-hall",
        26,
        26
      ],
      [
        "herbal-ward",
        26,
        43
      ]
    ],
    "div": [
      [
        "x",
        30,
        16,
        26,
        21
      ]
    ],
    "peak": [
      [
        12,
        15
      ],
      [
        41,
        15
      ],
      [
        13,
        39
      ],
      [
        41,
        39
      ]
    ],
    "roof": "mirage-four-court-asymmetric-lanterns"
  },
  {
    "t": "healers-house",
    "b": "snow",
    "s": "small",
    "variant": 5,
    "title": "Snowfin Sealed-Bridge Hospice",
    "dim": [
      34,
      13,
      34
    ],
    "r": [
      [
        13,
        21,
        1,
        31
      ],
      [
        4,
        14,
        8,
        21
      ],
      [
        21,
        30,
        17,
        29
      ],
      [
        5,
        14,
        26,
        31
      ]
    ],
    "e": [
      17,
      1
    ],
    "rooms": [
      [
        "waiting",
        17,
        5
      ],
      [
        "treatment",
        8,
        13
      ],
      [
        "recovery",
        26,
        23
      ],
      [
        "warming-ward",
        9,
        28
      ]
    ],
    "div": [
      [
        "x",
        21,
        16,
        25,
        20
      ]
    ],
    "peak": [
      [
        8,
        13
      ],
      [
        26,
        23
      ],
      [
        9,
        28
      ]
    ],
    "roof": "snowfin-crossed-icicle-hips"
  },
  {
    "t": "healers-house",
    "b": "snow",
    "s": "medium",
    "variant": 5,
    "title": "Whitecap Asymmetric Warming Ward",
    "dim": [
      44,
      15,
      42
    ],
    "r": [
      [
        17,
        25,
        1,
        38
      ],
      [
        3,
        18,
        8,
        20
      ],
      [
        25,
        41,
        15,
        29
      ],
      [
        9,
        33,
        35,
        40
      ]
    ],
    "discs": [
      [
        9,
        14,
        6,
        6
      ],
      [
        35,
        23,
        5,
        6
      ]
    ],
    "e": [
      21,
      1
    ],
    "rooms": [
      [
        "waiting",
        21,
        5
      ],
      [
        "treatment",
        9,
        14
      ],
      [
        "recovery",
        35,
        23
      ],
      [
        "warming-theatre",
        17,
        37
      ],
      [
        "medicine-drying",
        30,
        37
      ]
    ],
    "div": [
      [
        "x",
        25,
        16,
        24,
        19
      ]
    ],
    "peak": [
      [
        9,
        14
      ],
      [
        35,
        23
      ],
      [
        17,
        37
      ],
      [
        30,
        37
      ]
    ],
    "roof": "whitecap-staggered-triple-heated-crowns"
  },
  {
    "t": "healers-house",
    "b": "snow",
    "s": "large",
    "variant": 5,
    "title": "Glacierwatch Five-Arm Field Hospital",
    "dim": [
      55,
      17,
      51
    ],
    "r": [
      [
        23,
        31,
        1,
        47
      ],
      [
        4,
        24,
        8,
        21
      ],
      [
        31,
        52,
        13,
        26
      ],
      [
        6,
        23,
        34,
        47
      ],
      [
        32,
        50,
        35,
        47
      ],
      [
        19,
        37,
        24,
        29
      ]
    ],
    "discs": [
      [
        10,
        15,
        6,
        6
      ]
    ],
    "e": [
      27,
      1
    ],
    "rooms": [
      [
        "waiting",
        27,
        5
      ],
      [
        "treatment",
        12,
        15
      ],
      [
        "recovery",
        44,
        20
      ],
      [
        "cold-storage",
        12,
        40
      ],
      [
        "isolation",
        43,
        40
      ],
      [
        "triage",
        27,
        26
      ],
      [
        "surgical-ward",
        27,
        44
      ]
    ],
    "div": [
      [
        "x",
        31,
        18,
        27,
        23
      ]
    ],
    "peak": [
      [
        12,
        15
      ],
      [
        44,
        20
      ],
      [
        12,
        40
      ],
      [
        43,
        40
      ]
    ],
    "roof": "glacierwatch-five-independently-supported-ice-bridges"
  },
  {
    "t": "healers-house",
    "b": "enchanted-forest",
    "s": "small",
    "variant": 5,
    "title": "Lilythorn Petal-Nest Clinic",
    "dim": [
      35,
      13,
      35
    ],
    "r": [
      [
        13,
        21,
        1,
        32
      ],
      [
        8,
        28,
        18,
        22
      ]
    ],
    "discs": [
      [
        8,
        12,
        6,
        6
      ],
      [
        27,
        15,
        6,
        6
      ],
      [
        10,
        27,
        5,
        5
      ]
    ],
    "e": [
      17,
      1
    ],
    "rooms": [
      [
        "waiting",
        17,
        5
      ],
      [
        "treatment",
        8,
        12
      ],
      [
        "recovery",
        27,
        15
      ],
      [
        "root-remedy",
        10,
        27
      ]
    ],
    "div": [
      [
        "z",
        20,
        14,
        21,
        17
      ]
    ],
    "peak": [
      [
        8,
        12
      ],
      [
        27,
        15
      ],
      [
        10,
        27
      ]
    ],
    "roof": "lilythorn-three-offset-petal-canopies"
  },
  {
    "t": "healers-house",
    "b": "enchanted-forest",
    "s": "medium",
    "variant": 5,
    "title": "Moonhollow Winding Apothecary",
    "dim": [
      46,
      16,
      43
    ],
    "r": [
      [
        18,
        26,
        1,
        40
      ],
      [
        9,
        37,
        23,
        27
      ],
      [
        13,
        22,
        10,
        18
      ],
      [
        24,
        34,
        14,
        19
      ],
      [
        28,
        36,
        25,
        35
      ]
    ],
    "discs": [
      [
        10,
        13,
        8,
        7
      ],
      [
        36,
        16,
        7,
        8
      ],
      [
        12,
        34,
        7,
        7
      ],
      [
        35,
        34,
        6,
        6
      ]
    ],
    "e": [
      22,
      1
    ],
    "rooms": [
      [
        "waiting",
        22,
        5
      ],
      [
        "treatment",
        10,
        13
      ],
      [
        "recovery",
        36,
        16
      ],
      [
        "herb-vault",
        12,
        34
      ],
      [
        "tincture-lab",
        35,
        34
      ],
      [
        "moonwell-pavilion",
        22,
        25
      ]
    ],
    "div": [
      [
        "x",
        26,
        15,
        25,
        18
      ]
    ],
    "peak": [
      [
        10,
        13
      ],
      [
        36,
        16
      ],
      [
        12,
        34
      ],
      [
        35,
        34
      ]
    ],
    "roof": "moonhollow-independent-arcade-canopies"
  },
  {
    "t": "healers-house",
    "b": "enchanted-forest",
    "s": "large",
    "variant": 5,
    "title": "Starroot Grand Conservatory Hospital",
    "dim": [
      57,
      18,
      53
    ],
    "r": [
      [
        24,
        32,
        1,
        50
      ],
      [
        13,
        44,
        22,
        29
      ],
      [
        17,
        27,
        11,
        21
      ],
      [
        29,
        40,
        12,
        21
      ],
      [
        16,
        28,
        34,
        45
      ],
      [
        30,
        40,
        34,
        45
      ]
    ],
    "discs": [
      [
        13,
        16,
        10,
        10
      ],
      [
        44,
        16,
        10,
        10
      ],
      [
        14,
        43,
        9,
        8
      ],
      [
        43,
        43,
        9,
        8
      ]
    ],
    "holes": [
      [
        13,
        16,
        2,
        2
      ],
      [
        44,
        43,
        2,
        2
      ]
    ],
    "e": [
      28,
      1
    ],
    "rooms": [
      [
        "waiting",
        28,
        5
      ],
      [
        "treatment",
        9,
        14
      ],
      [
        "recovery",
        45,
        17
      ],
      [
        "healing-garden",
        14,
        43
      ],
      [
        "isolation",
        40,
        40
      ],
      [
        "sunwater-gallery",
        28,
        26
      ],
      [
        "root-study",
        28,
        45
      ]
    ],
    "div": [
      [
        "z",
        25,
        19,
        36,
        28
      ]
    ],
    "peak": [
      [
        13,
        16
      ],
      [
        44,
        16
      ],
      [
        14,
        43
      ],
      [
        43,
        43
      ]
    ],
    "roof": "starroot-organic-open-sky-elliptical-terraces"
  },
  {
    "t": "healers-house",
    "b": "mountain",
    "s": "small",
    "variant": 5,
    "title": "Stonecoil Ridgehook Dispensary",
    "dim": [
      35,
      13,
      35
    ],
    "r": [
      [
        13,
        21,
        1,
        32
      ],
      [
        3,
        14,
        7,
        16
      ],
      [
        21,
        31,
        20,
        30
      ],
      [
        4,
        16,
        26,
        32
      ]
    ],
    "e": [
      17,
      1
    ],
    "rooms": [
      [
        "waiting",
        17,
        5
      ],
      [
        "treatment",
        8,
        12
      ],
      [
        "recovery",
        27,
        25
      ],
      [
        "remedy-atelier",
        9,
        29
      ]
    ],
    "div": [
      [
        "x",
        21,
        17,
        25,
        21
      ]
    ],
    "peak": [
      [
        8,
        12
      ],
      [
        27,
        25
      ],
      [
        9,
        29
      ]
    ],
    "roof": "stonecoil-opposed-high-ridge-shelves"
  },
  {
    "t": "healers-house",
    "b": "mountain",
    "s": "medium",
    "variant": 5,
    "title": "Cragwater Dual-Shelf Surgical House",
    "dim": [
      46,
      16,
      43
    ],
    "r": [
      [
        18,
        26,
        1,
        40
      ],
      [
        3,
        20,
        8,
        20
      ],
      [
        25,
        43,
        19,
        33
      ],
      [
        10,
        34,
        37,
        41
      ]
    ],
    "discs": [
      [
        10,
        14,
        7,
        6
      ],
      [
        36,
        26,
        6,
        6
      ]
    ],
    "e": [
      22,
      1
    ],
    "rooms": [
      [
        "waiting",
        22,
        5
      ],
      [
        "treatment",
        10,
        14
      ],
      [
        "recovery",
        36,
        26
      ],
      [
        "restorative-beds",
        17,
        39
      ],
      [
        "apothecary",
        30,
        39
      ],
      [
        "diagnostic-study",
        22,
        24
      ]
    ],
    "div": [
      [
        "x",
        25,
        17,
        26,
        21
      ]
    ],
    "peak": [
      [
        10,
        14
      ],
      [
        36,
        26
      ],
      [
        17,
        39
      ],
      [
        30,
        39
      ]
    ],
    "roof": "cragwater-braided-four-rockface-ridges"
  },
  {
    "t": "healers-house",
    "b": "mountain",
    "s": "large",
    "variant": 5,
    "title": "Highspine Broken-Crescent Ward Fort",
    "dim": [
      57,
      18,
      52
    ],
    "r": [
      [
        24,
        33,
        1,
        49
      ],
      [
        3,
        25,
        10,
        23
      ],
      [
        32,
        54,
        13,
        28
      ],
      [
        7,
        26,
        36,
        49
      ],
      [
        33,
        54,
        35,
        48
      ]
    ],
    "discs": [
      [
        11,
        17,
        8,
        7
      ],
      [
        46,
        20,
        7,
        7
      ]
    ],
    "e": [
      28,
      1
    ],
    "rooms": [
      [
        "waiting",
        28,
        5
      ],
      [
        "treatment",
        11,
        17
      ],
      [
        "recovery",
        46,
        20
      ],
      [
        "isolation",
        14,
        42
      ],
      [
        "herbal-forge",
        46,
        42
      ],
      [
        "rehabilitation",
        28,
        26
      ],
      [
        "surgeon-study",
        28,
        46
      ]
    ],
    "div": [
      [
        "x",
        32,
        18,
        27,
        21
      ]
    ],
    "peak": [
      [
        11,
        17
      ],
      [
        46,
        20
      ],
      [
        14,
        42
      ],
      [
        46,
        42
      ]
    ],
    "roof": "highspine-broken-crescent-cliff-crowns"
  }
]);
export const M2_VARIANT05_FINAL15=Object.freeze(PLANS.map(buildDistinctive4B));
export const M2_138_ALL=Object.freeze([...M2_123_ALL,...M2_VARIANT05_FINAL15]);
export const M2_138_CENSUS=Object.freeze({newModels:M2_VARIANT05_FINAL15.length,authored:M2_138_ALL.length,remaining:285-M2_138_ALL.length,healers:M2_138_ALL.filter(b=>b.type==='healers-house').length,libraries:M2_138_ALL.filter(b=>b.type==='library').length,fingerprints:new Set(M2_138_ALL.map(geometrySignature)).size,creatorApproved:0,integrated:0});
validateCollection(M2_138_ALL);
if(M2_138_CENSUS.newModels!==15||M2_138_CENSUS.authored!==138||M2_138_CENSUS.healers!==75||M2_138_CENSUS.libraries!==60||M2_138_CENSUS.fingerprints!==138)throw Error('Builder 4B final M2 healer census failed');
export const M2_VARIANT05_FINAL_NAMES=Object.freeze(PLANS.map(p=>p.title));
