// ===============================
// DICIONÁRIOS PRINCIPAIS
// ===============================

export const ALL_CLASSES = {};
export const ALL_RACES = {};
export const ALL_FEATS = {};
export const ALL_BACKGROUNDS = {};
export const ALL_CLASS_FEATURES = {};
export const ALL_SUBCLASS_FEATURES = {};

export const EDITIONS = {
  CLASSIC: "Classic",
  ONE: "One",
};

// ===============================
// REGISTRO DE CLASSES
// ===============================

export function registerClassFile(classData, forcedSource = "default", forcedEdition = "default") {
  if (!Array.isArray(classData?.class)) return;

  classData.class.forEach(baseClass => {
    const edition = forcedEdition;
    const source = forcedSource;
    const classKey = baseClass.name;

    ALL_CLASSES[edition] ??= {};
    ALL_CLASSES[edition][source] ??= {};
    ALL_CLASSES[edition][source][classKey] ??= {
      class: null,
      subclasses: {}
    };

    ALL_CLASSES[edition][source][classKey].class = baseClass;
  });

  if (Array.isArray(classData.subclass)) {
    classData.subclass.forEach(sc => {
      const edition = forcedEdition;
      const source = forcedSource;
      const classKey = sc.className;

      const classEntry =
        ALL_CLASSES?.[edition]?.[source]?.[classKey];

      if (!classEntry) return;

      classEntry.subclasses[sc.name] = sc;
    });
  }
}

// ===============================
// FEATURES DE CLASSE
// ===============================

export function registerClassFeatures(classFeatureData, forcedSource = "default",forcedEdition = "default") {
  if (!Array.isArray(classFeatureData)) return;

  classFeatureData.forEach(feature => {
    const edition = forcedEdition;
    const source = forcedSource;
    const classKey = feature.className;

    ALL_CLASS_FEATURES[edition] ??= {};
    ALL_CLASS_FEATURES[edition][source] ??= {};
    ALL_CLASS_FEATURES[edition][source][classKey] ??= [];

    ALL_CLASS_FEATURES[edition][source][classKey].push(feature);
  });
}

// ===============================
// FEATURES DE SUBCLASSE
// ===============================

export function registerSubclassFeatures(subclassFeatureData, forcedSource = "default",forcedEdition = "default") {
  if (!Array.isArray(subclassFeatureData)) return;

  subclassFeatureData.forEach(feature => {
    const edition = forcedEdition;
    const source = forcedSource;
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

    if (!subclassKey) {
      console.warn(
        "Subclass não encontrada:",
        feature.subclassShortName,
        "para",
        classKey
      );
      return;
    }

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

export function registerFeat(feat, forcedSource = "default", forcedEdition = "default") {
    const edition = forcedEdition;
  const source = forcedSource;
  const key = feat.name;

  ALL_FEATS[edition] ??= {};
  ALL_FEATS[edition][source] ??= {};
  ALL_FEATS[edition][source][key] = feat;
}

// ===============================
// RAÇAS
// ===============================

export function registerRaceFile(raceData, forcedSource = "default", forcedEdition = "default") {
  raceData.race?.forEach(race => {
    const edition = forcedEdition;
    const source = forcedSource;
    const key = race.name;

    ALL_RACES[edition] ??= {};
    ALL_RACES[edition][source] ??= {};
    ALL_RACES[edition][source][key] ??= {
      race: race,
      subraces: {}
    };
  });

  raceData.subrace?.forEach(sr => {
    const edition = forcedEdition;
    const source = forcedSource;
    const key = sr.raceName;

    ALL_RACES[edition] ??= {};
    ALL_RACES[edition][source] ??= {};
    ALL_RACES[edition][source][key] ??= {
      race: null,
      subraces: {}
    };

    ALL_RACES[edition][source][key].subraces[sr.name] = sr;
  });
}

// ===============================
// BACKGROUNDS
// ===============================

export function registerBackground(bg, forcedSource = "default", forcedEdition = "default") {
    const edition = forcedEdition;
  const source = forcedSource;
  const key = bg.name;

  ALL_BACKGROUNDS[edition] ??= {};
  ALL_BACKGROUNDS[edition][source] ??= {};
  ALL_BACKGROUNDS[edition][source][key] = bg;
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

export function getClassFeatures(classKey, edition, source) {
  return ALL_CLASS_FEATURES?.[edition]?.[source]?.[classKey] ?? [];
}

export function getSubclassFeatures(classKey, subclassKey, edition, source) {
  return (
    ALL_SUBCLASS_FEATURES?.[edition]?.[source]?.[classKey]?.[subclassKey] ?? []
  );
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
