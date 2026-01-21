// ===============================
// DICIONÁRIOS PRINCIPAIS
// ===============================

export const ALL_CLASSES = {};
export const ALL_RACES = {};
export const ALL_FEATS = {};
export const ALL_BACKGROUNDS = {};

export const EDITIONS = {
  CLASSIC: "Classic",
  ONE: "One"
};

function detectEditionFromSource(source) {
  // ajuste conforme seu dataset
  if (!source) return EDITIONS.CLASSIC;

  if (source.startsWith("X") || source === "XPHB") {
    return EDITIONS.ONE;
  }

  return EDITIONS.CLASSIC;
}

export function registerClassFile(classData) {
  if (!classData?.class?.length) return;

  Array.isArray(classData.class) 
  {
    classData.class.forEach(baseClass => {
  
    const classKey = baseClass.name.toLowerCase();
    const source = baseClass.source;
    const edition = detectEditionFromSource(source);
    
    // Inicializações
    ALL_CLASSES[classKey] ??= {};
    ALL_CLASSES[classKey][edition] ??= {};
    ALL_CLASSES[classKey][edition][source] ??= {
      class: null,
      subclasses: {}
    };

    // Classe base
    ALL_CLASSES[classKey][edition][source].class = baseClass;

    // Subclasses
    if (Array.isArray(classData.subclass)) {
      classData.subclass.forEach(sc => {
        ALL_CLASSES[classKey][edition][source].subclasses[sc.name] = sc;
      });
    }});
  }
}

export function registerFeat(feat) {
  const key = feat.name;
  const source = feat.source;
  const edition = detectEditionFromSource(source);

  ALL_FEATS[key] ??= {};
  ALL_FEATS[key][edition] ??= {};
  ALL_FEATS[key][edition][source] = feat;
}

export function registerRaceFile(raceData) {
  raceData.race?.forEach(race => {
    const key = race.name.toLowerCase();
    const source = race.source;
    const edition = detectEditionFromSource(source);

    ALL_RACES[key] ??= {};
    ALL_RACES[key][edition] ??= {};
    ALL_RACES[key][edition][source] ??= {
      race: race,
      subraces: {}
    };
  });

  raceData.subrace?.forEach(sr => {
    const key = sr.raceName.toLowerCase();
    const source = sr.source;
    const edition = detectEditionFromSource(source);

    ALL_RACES[key] ??= {};
    ALL_RACES[key][edition] ??= {};
    ALL_RACES[key][edition][source] ??= {
      race: null,
      subraces: {}
    };

    ALL_RACES[key][edition][source].subraces[sr.name] = sr;
  });
}

export function getClass({
  classKey,
  edition,
  source
}) {
  return ALL_CLASSES?.[classKey]?.[edition]?.[source]?.class ?? null;
}

export function getSubClass({
  classKey,
  edition,
  source,
  subclassName
}) {
  return ALL_CLASSES?.[classKey]?.[edition]?.[source]?.subclasses?.[subclassName] ?? null;
}

export function getAvailableClassEditions(classKey) {
  return Object.keys(ALL_CLASSES?.[classKey] ?? {});
}

export function getAvailableClassSources(classKey, edition) {
  return Object.keys(ALL_CLASSES?.[classKey]?.[edition] ?? {});
}

export function getAvailableSubclasses(classKey, edition, source) {
  return Object.keys(
    ALL_CLASSES?.[classKey]?.[edition]?.[source]?.subclasses ?? {}
  );
}



export function getFeat({ name, edition, source }) {
  return ALL_FEATS?.[name]?.[edition]?.[source] ?? null;
}

export function registerBackground(bg) {
  const key = bg.name;
  const source = bg.source;
  const edition = detectEditionFromSource(source);

  ALL_BACKGROUNDS[key] ??= {};
  ALL_BACKGROUNDS[key][edition] ??= {};
  ALL_BACKGROUNDS[key][edition][source] = bg;
}
