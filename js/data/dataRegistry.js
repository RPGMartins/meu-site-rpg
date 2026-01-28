// ===============================
// DICIONÁRIOS PRINCIPAIS
// ===============================

export const ALL_CLASSES = {};
export const ALL_RACES = {};
export const ALL_FEATS = {};
export const ALL_BACKGROUNDS = {};
export const ALL_CLASS_FEATURES = {};
export const ALL_SUBCLASS_FEATURES = {};
export const ALL_RACE_FEATURES = {};
export const ALL_SUBRACE_FEATURES = {};

export const SOURCE_REGISTRY = {
  homebrew: {}
};

export const VIRTUAL_SOURCES = {
  ALL: "__ALL__",
  ALL_BASE: "__ALL_BASE__",
  ALL_HOMEBREW: "__ALL_HOMEBREW__"
};

export function registerSourcesFromMeta(file) {

  let group = null;
  const meta = file._meta;
  if(!file.book)
    {
      group = "homebrew";
    }
    else
    {
      group = file.book[0].group === "homebrew"
        ? "homebrew"
        : "official";
    }


  if (!meta?.sources) return;

  meta.sources.forEach(src => {
    SOURCE_REGISTRY[group][src.json] = {
      id: src.json,
      name: src.full,
      abbreviation: src.abbreviation,
      edition: meta.edition ?? null,
      color: src.color ?? null
    };
  });
}

export async function loadHomebrewFromFile(file,initClassUI) {
  
  registerSourcesFromMeta(file);
  const data = file;
  const edition = data._meta?.edition ?? "classic";
  const validSources = data._meta?.sources?.map(s => s.json) ?? [];

  loadFile(data,edition,validSources);
}

export async function loadFromFile(file,editionName,validSources) {
  
  const data = file;
  const edition = editionName;

  loadFile(data,edition,validSources);
}

function loadFile(data, edition, validSources)
{
  registerClassFile(data, edition, validSources);
  registerClassFeatures(data.classFeature, edition, validSources);
  registerSubclassFeatures(data.subclassFeature, edition, validSources);
  registerRaceFile(data, edition, validSources);
  registerRaceFeatures(data, edition, validSources);
  registerSubraceFeatures(data, edition, validSources);

  data.feat?.forEach(f => registerFeat(f, edition, validSources));
  data.background?.forEach(b => registerBackground(b, edition, validSources));

  cleanupEmptySources(ALL_CLASSES);
  cleanupEmptySources(ALL_RACES);
  cleanupEmptySources(ALL_FEATS);
  cleanupEmptySources(ALL_BACKGROUNDS);
  cleanupEmptySources(ALL_CLASS_FEATURES);
  cleanupEmptySources(ALL_SUBCLASS_FEATURES);
  cleanupEmptySources(ALL_RACE_FEATURES);
  cleanupEmptySources(ALL_SUBRACE_FEATURES);

}

function cleanupEmptySources(dict) {
  for (const edition in dict) {
    for (const source in dict[edition]) {
      if (Object.keys(dict[edition][source]).length === 0) {
        delete dict[edition][source];
      }
    }
  }
}
function hasPlayableClassData(cls) {
  // Classe sem features ainda é válida
  return (
    Array.isArray(cls.classFeatures) ||
    Array.isArray(cls.entries) ||
    cls.hd ||
    cls.proficiency ||
    cls.spellcasting
  );
}
function hasPlayableFeatData(feat) {
  return Array.isArray(feat.entries) && feat.entries.length > 0;
}
function hasPlayableRaceData(race) {
  return (
    Array.isArray(race.entries) ||
    race.speed ||
    race.size ||
    race.traitTags
  );
}
function hasPlayableSubraceData(subrace) {
  return Array.isArray(subrace.entries) && subrace.entries.length > 0;
}
function hasPlayableBackgroundData(bg) {
  return (
    Array.isArray(bg.entries) ||
    bg.skillProficiencies ||
    bg.toolProficiencies ||
    bg.languageProficiencies
  );
}


// ===============================
// CLASSES
// ===============================

export function registerClassFile(classData, forcedEdition, validSources = []) {
  if (!Array.isArray(classData?.class)) return;

  classData.class.forEach(baseClass => {
  if (!ValidateSource(validSources, baseClass.source)) return;
  if (!hasPlayableClassData(baseClass)) return;

    const edition = forcedEdition;
    const source = baseClass.source;
    const classKey = baseClass.name;

    ALL_CLASSES[edition] ??= {};
    ALL_CLASSES[edition][source] ??= {};
    ALL_CLASSES[edition][source][classKey] ??= {
      class: null,
      subclasses: {}
    };

    ALL_CLASSES[edition][source][classKey].class = baseClass;
  });

  if (!Array.isArray(classData.subclass)) return;

  classData.subclass.forEach(sc => {

    if (!ValidateSource(validSources, sc.source)) return;

    const edition = forcedEdition;
    const source = sc.classSource;
    const classKey = sc.className;

    const classEntry =
      ALL_CLASSES?.[edition]?.[source]?.[classKey];

    if (!classEntry) return;

    classEntry.subclasses[sc.name] = sc;
  });
}

// ===============================
// CLASS FEATURES
// ===============================

export function registerClassFeatures(classFeatureData, forcedEdition, validSources = []) {
  if (!Array.isArray(classFeatureData)) return;

  classFeatureData.forEach(feature => {

    if (!ValidateSource(validSources, feature.source)) return;

    const edition = forcedEdition;
    const source = feature.classSource;
    const classKey = feature.className;

    ALL_CLASS_FEATURES[edition] ??= {};
    ALL_CLASS_FEATURES[edition][source] ??= {};
    ALL_CLASS_FEATURES[edition][source][classKey] ??= [];

    ALL_CLASS_FEATURES[edition][source][classKey].push(feature);
  });
}

// ===============================
// SUBCLASS FEATURES
// ===============================

export function registerSubclassFeatures(subclassFeatureData, forcedEdition, validSources = []) {
  if (!Array.isArray(subclassFeatureData)) return;

  subclassFeatureData.forEach(feature => {

    if (!ValidateSource(validSources, feature.source)) return;

    const edition = forcedEdition;
    const source = feature.classSource;
    const classKey = feature.className;

    const subclasses =
      ALL_CLASSES?.[edition]?.[source]?.[classKey]?.subclasses;

    if (!subclasses) return;

    let subclassKey = null;

    for (const key in subclasses) {
      if (subclasses[key].shortName === feature.subclassShortName) {
        subclassKey = key;
        break;
      }
    }

    if (!subclassKey) return;

    ALL_SUBCLASS_FEATURES[edition] ??= {};
    ALL_SUBCLASS_FEATURES[edition][source] ??= {};
    ALL_SUBCLASS_FEATURES[edition][source][classKey] ??= {};
    ALL_SUBCLASS_FEATURES[edition][source][classKey][subclassKey] ??= [];

    ALL_SUBCLASS_FEATURES[edition][source][classKey][subclassKey].push(feature);
  });
}

// ===============================
// FEATS
// ===============================

export function registerFeat(feat, forcedEdition, validSources = []) {
  if (!ValidateSource(validSources, feat.source)) return;
  if (!hasPlayableFeatData(feat)) return;
  
  const edition = forcedEdition;
  const source = feat.source;
  const key = feat.name;

  ALL_FEATS[edition] ??= {};
  ALL_FEATS[edition][source] ??= {};
  ALL_FEATS[edition][source][key] = feat;
}

// ===============================
// RAÇAS
// ===============================

export function registerRaceFile(raceData, forcedEdition, validSources = []) {

  raceData.race?.forEach(race => {

    if (!ValidateSource(validSources, race.source)) return;
    if (!hasPlayableRaceData(race)) return;

    const edition = forcedEdition;
    const source = race.source;
    const key = race.name;

    ALL_RACES[edition] ??= {};
    ALL_RACES[edition][source] ??= {};
    ALL_RACES[edition][source][key] ??= {
      race: race,
      subraces: {}
    };
  });

  raceData.subrace?.forEach(sr => {

    if (!ValidateSource(validSources, sr.source)) return;

    const edition = forcedEdition;
    const source = sr.source;
    const key = sr.raceName;

    const raceEntry =
      ALL_RACES?.[edition]?.[source]?.[key];

    if (!raceEntry) return;

    raceEntry.subraces[sr.name] = sr;
  });
}

function registerRaceFeatures(raceData, forcedEdition, validSources = []) {
  if (!Array.isArray(raceData?.race)) return;

  raceData.race.forEach(race => {

    if (!ValidateSource(validSources, race.source)) return;

    if (!Array.isArray(race.entries)) return;

    const edition = forcedEdition;
    const source = race.source;
    const raceKey = race.name;

    ALL_RACE_FEATURES[edition] ??= {};
    ALL_RACE_FEATURES[edition][source] ??= {};
    ALL_RACE_FEATURES[edition][source][raceKey] ??= [];

    race.entries.forEach(entry => {
      if (entry.name) {
        ALL_RACE_FEATURES[edition][source][raceKey].push(entry);
      }
    });
  });
}

function registerSubraceFeatures(raceData, forcedEdition, validSources = []) {
  if (!Array.isArray(raceData?.subrace)) return;

  raceData.subrace.forEach(subrace => {
    if (!ValidateSource(validSources, subrace.source)) return;
    if (!hasPlayableSubraceData(subrace)) return;
    if (!Array.isArray(subrace.entries)) return;

    const edition = forcedEdition;
    const source = subrace.raceSource;
    const raceKey = subrace.raceName;
    const subraceKey = subrace.name;

    ALL_SUBRACE_FEATURES[edition] ??= {};
    ALL_SUBRACE_FEATURES[edition][source] ??= {};
    ALL_SUBRACE_FEATURES[edition][source][raceKey] ??= {};
    ALL_SUBRACE_FEATURES[edition][source][raceKey][subraceKey] ??= [];

    subrace.entries.forEach(entry => {
      if (entry.name) {
        ALL_SUBRACE_FEATURES[edition][source][raceKey][subraceKey].push(entry);
      }
    });
  });
}


// ===============================
// BACKGROUNDS
// ===============================

export function registerBackground(bg, forcedEdition, validSources = []) {
  if (!ValidateSource(validSources, bg.source)) return;
  if (!hasPlayableBackgroundData(bg)) return;
  
  const edition = forcedEdition;
  const source = bg.source;
  const key = bg.name;

  ALL_BACKGROUNDS[edition] ??= {};
  ALL_BACKGROUNDS[edition][source] ??= {};
  ALL_BACKGROUNDS[edition][source][key] = bg;
}

// ===============================
// HOMEBREW
// ===============================


export function removeHomebrewDataRegistry(sourceId) {

  delete SOURCE_REGISTRY.homebrew[sourceId];

  for (const edition in ALL_CLASSES) {
    delete ALL_CLASSES[edition]?.[sourceId];
    delete ALL_RACES[edition]?.[sourceId];
    delete ALL_FEATS[edition]?.[sourceId];
    delete ALL_BACKGROUNDS[edition]?.[sourceId];
    delete ALL_CLASS_FEATURES[edition]?.[sourceId];
    delete ALL_SUBCLASS_FEATURES[edition]?.[sourceId];
  }
}


// ===============================
// GETTERS
// ===============================

export function getClass(classKey, edition, source) {
  return ALL_CLASSES?.[edition]?.[source]?.[classKey]?.class ?? null;
}

export function getSubClass(classKey, edition, source, subclassKey) {
  return ALL_CLASSES?.[edition]?.[source]?.[classKey]?.subclasses?.[subclassKey] ?? null;
}

export function getAvailableEditions() {
  return Object.keys(ALL_CLASSES);
}

export function getAvailableSources(edition) {
  return Object.keys(ALL_CLASSES?.[edition] ?? {});
}

export function getAvailableClasses(edition, source) {
  return Object.keys(ALL_CLASSES?.[edition]?.[source] ?? {});
}

export function getAvailableSubclasses(edition, source, classKey) {
  return Object.keys(
    ALL_CLASSES?.[edition]?.[source]?.[classKey]?.subclasses ?? {}
  );
}

export function getRaceFeatures(raceKey, edition, source) {
  return ALL_RACE_FEATURES?.[edition]?.[source]?.[raceKey] ?? [];
}

export function getSubraceFeatures(raceKey, subraceKey, edition, source) {
  return ALL_SUBRACE_FEATURES?.[edition]?.[source]?.[raceKey]?.[subraceKey] ?? [];
}

export function getAllSelectedRaceFeatures(raceKey, subraceKey, edition, source) {
  return [
    ...getRaceFeatures(raceKey, edition, source),
    ...(subraceKey
      ? getSubraceFeatures(raceKey, subraceKey, edition, source)
      : [])
  ];
}


export function getClassFeatures(classKey, edition, source) {
  return ALL_CLASS_FEATURES?.[edition]?.[source]?.[classKey] ?? [];
}

export function getSubclassFeatures(classKey, subclassKey, edition, source) {
  return ALL_SUBCLASS_FEATURES?.[edition]?.[source]?.[classKey]?.[subclassKey] ?? [];
}

export function getAllSelectedFeatures(classKey, subclassKey, edition, source) {
  return [
    ...getClassFeatures(classKey, edition, source),
    ...(subclassKey
      ? getSubclassFeatures(classKey, subclassKey, edition, source)
      : [])
  ];
}

export function getFeat(name, edition, source) {
  return ALL_FEATS?.[edition]?.[source]?.[name] ?? null;
}

// ===============================
// UTILS
// ===============================

function ValidateSource(validSources, source) {
  if (validSources.length === 0) return true;
  return validSources.includes(source);
}

function isHomebrewSource(source) {
  return !!SOURCE_REGISTRY.homebrew[source];
}

export function getAvailableRaceSources(edition) {
  const realSources = Object.keys(ALL_RACES?.[edition] ?? {});

  return [
    VIRTUAL_SOURCES.ALL,
    VIRTUAL_SOURCES.ALL_BASE,
    VIRTUAL_SOURCES.ALL_HOMEBREW,
    ...realSources
  ];
}

export function getAvailableRaces(edition, sourceFilter) {
  const editionData = ALL_RACES?.[edition];
  if (!editionData) return [];

  let sourcesToScan = [];

  switch (sourceFilter) {
    case VIRTUAL_SOURCES.ALL:
      sourcesToScan = Object.keys(editionData);
      break;

    case VIRTUAL_SOURCES.ALL_BASE:
      sourcesToScan = Object.keys(editionData)
        .filter(src => !isHomebrewSource(src));
      break;

    case VIRTUAL_SOURCES.ALL_HOMEBREW:
      sourcesToScan = Object.keys(editionData)
        .filter(isHomebrewSource);
      break;

    default:
      sourcesToScan = [sourceFilter];
      break;
  }

  const result = [];

  sourcesToScan.forEach(source => {
    const racesInSource = editionData[source];
    if (!racesInSource) return;

    Object.keys(racesInSource).forEach(raceName => {
      result.push({
        raceName,
        source
      });
    });
  });

  return result;
}

export function getRace(edition, source, raceName) {
  return ALL_RACES?.[edition]?.[source]?.[raceName] ?? null;
}

export function getSubrace(edition, source, raceName, subraceName) {
  return getRace(edition,source,raceName)?.subraces[subraceName] ?? null;
}


export function getAvailableBackgroundSources(edition) {
  const realSources = Object.keys(ALL_BACKGROUNDS?.[edition] ?? {});

  return [
    VIRTUAL_SOURCES.ALL,
    VIRTUAL_SOURCES.ALL_BASE,
    VIRTUAL_SOURCES.ALL_HOMEBREW,
    ...realSources
  ];
}

export function getAvailableBackgrounds(edition, sourceFilter) {
  const editionData = ALL_BACKGROUNDS?.[edition];
  if (!editionData) return [];

  let sourcesToScan = [];

  switch (sourceFilter) {
    case VIRTUAL_SOURCES.ALL:
      sourcesToScan = Object.keys(editionData);
      break;

    case VIRTUAL_SOURCES.ALL_BASE:
      sourcesToScan = Object.keys(editionData)
        .filter(src => !isHomebrewSource(src));
      break;

    case VIRTUAL_SOURCES.ALL_HOMEBREW:
      sourcesToScan = Object.keys(editionData)
        .filter(isHomebrewSource);
      break;

    default:
      sourcesToScan = [sourceFilter];
      break;
  }

  const result = [];

  sourcesToScan.forEach(source => {
    const bgsInSource = editionData[source];
    if (!bgsInSource) return;

    Object.keys(bgsInSource).forEach(bgName => {
      result.push({
        backgroundName: bgName,
        source
      });
    });
  });

  return result;
}

export function getBackground(edition, sourceFilter,backgroundKey)
{
  return ALL_BACKGROUNDS?.[edition]?.[sourceFilter]?.[backgroundKey];
}


export function getAvailableFeatSources(edition) {
  const realSources = Object.keys(ALL_FEATS?.[edition] ?? {});

  return [
    VIRTUAL_SOURCES.ALL,
    VIRTUAL_SOURCES.ALL_BASE,
    VIRTUAL_SOURCES.ALL_HOMEBREW,
    ...realSources
  ];
}

export function getAvailableFeats(edition, sourceFilter) {
  const editionData = ALL_FEATS?.[edition];
  if (!editionData) return [];

  let sourcesToScan = [];

  switch (sourceFilter) {
    case VIRTUAL_SOURCES.ALL:
      sourcesToScan = Object.keys(editionData);
      break;

    case VIRTUAL_SOURCES.ALL_BASE:
      sourcesToScan = Object.keys(editionData)
        .filter(src => !isHomebrewSource(src));
      break;

    case VIRTUAL_SOURCES.ALL_HOMEBREW:
      sourcesToScan = Object.keys(editionData)
        .filter(isHomebrewSource);
      break;

    default:
      sourcesToScan = [sourceFilter];
      break;
  }

  const result = [];

  sourcesToScan.forEach(source => {
    const featsInSource = editionData[source];
    if (!featsInSource) return;

    Object.keys(featsInSource).forEach(featName => {
      result.push({
        featName,
        source
      });
    });
  });

  return result;
}
