// Authored per-building architectural briefs, not RNG seeds, color swaps or copy indices.
// Each row fixes an independent footprint, zoning plan, roof profile, entrance and physical silhouette feature.
export const DESIGN_MATRIX = Object.freeze({
  house: Object.freeze({
    temperate: [
      ['Foxglove Croft',11,12,'rear','gable','porch',-1],
      ['Millstream Half-Timber Home',15,16,'split','hip','chimney',2],
      ['Orchard Hall',21,19,'cross','monitor','arcade',-2]],
    desert: [
      ['Windward Adobe Dwelling',12,11,'side','terrace','buttress',-2],
      ['Oasis Courtyard House',17,15,'split','courtyard','arcade',1],
      ['Sunstep Merchant Compound',22,21,'cross','terrace','tower',2]],
    snow: [
      ['Rimepine Shelter',12,13,'rear','steep','chimney',1],
      ['Northwind Log Chalet',16,17,'split','gable','porch',-2],
      ['Winterfire Longhouse',23,18,'cross','steep','tower',-1]],
    'enchanted-forest': [
      ['Glowroot Cottage',11,13,'side','dome','tower',-1],
      ['Whisperleaf Canopy Home',17,16,'split','butterfly','skylight',2],
      ['Elderbough Gathering House',22,20,'cross','dome','arcade',1]],
    mountain: [
      ['Switchback Stone Hut',12,12,'rear','shed','buttress',-1],
      ['Cliffbraced Terrace Home',17,15,'side','shed','buttress',2],
      ['Highridge Buttressed Hall',24,20,'cross','hip','tower',-2]]
  }),
  tavern: Object.freeze({
    temperate: [
      ['Thistle and Tankard',12,13,'side','gable','chimney',-1],
      ['Three Roads Alehouse',17,16,'split','monitor','porch',1],
      ['Riverbend Feast Hall',23,20,'cross','hip','arcade',-2]],
    desert: [
      ['Spice Lantern Tea House',13,12,'rear','terrace','arcade',2],
      ['Caravan Shade Tavern',18,16,'split','courtyard','buttress',-1],
      ['Seven Suns Feast Court',23,22,'cross','terrace','tower',2]],
    snow: [
      ['Frostmug Hearth',12,14,'rear','steep','chimney',-1],
      ['Glacier Road Lodge',18,18,'side','gable','porch',-2],
      ['Long Ember Mead Hall',24,19,'cross','steep','tower',1]],
    'enchanted-forest': [
      ['Mooncap Taproom',13,12,'side','dome','skylight',1],
      ['Lanterngrove Public Hall',17,18,'split','butterfly','arcade',-2],
      ['Starlit Revel Court',23,21,'cross','monitor','tower',2]],
    mountain: [
      ['Quarry Cup Tavern',13,13,'rear','shed','buttress',2],
      ['Stonebridge Ale Gallery',18,17,'split','shed','buttress',-1],
      ['Cragspire Banquet House',24,22,'cross','steep','buttress',-2]]
  }),
  stable: Object.freeze({
    temperate: [
      ['Meadowgate Empty Stalls',13,14,'stable','gable','porch',0],
      ['Coachroad Carriage Barn',18,17,'stable','hip','chimney',0],
      ['Grand Pasture Yard',24,22,'stable','monitor','arcade',0]],
    desert: [
      ['Duneshade Open Stable',14,13,'stable','terrace','buttress',0],
      ['Sandway Covered Pens',19,17,'stable','courtyard','arcade',0],
      ['Oasis Caravansary Stables',25,22,'stable','terrace','tower',0]],
    snow: [
      ['Driftside Shelter Stalls',14,14,'stable','steep','chimney',0],
      ['Icepath Insulated Barn',19,18,'stable','gable','buttress',0],
      ['Whitepine Winter Stable',25,23,'stable','steep','tower',0]],
    'enchanted-forest': [
      ['Mossbridge Empty Pens',13,15,'stable','dome','skylight',0],
      ['Rootlantern Shelter',19,18,'stable','butterfly','arcade',0],
      ['Faelight Sanctuary Stable',25,21,'stable','monitor','tower',0]],
    mountain: [
      ['Talus Road Stable',14,15,'stable','shed','buttress',0],
      ['Highpass Shelter Barn',19,19,'stable','hip','chimney',0],
      ['Cliffwatch Pack Stable',26,22,'stable','steep','buttress',0]]
  })
});
