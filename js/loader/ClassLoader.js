let ALL_CLASSES_INDEX = null;

export  async function initClassLoader(classPath,editionName,validSources,loadFile) {

  ALL_CLASSES_INDEX = await loadClassesIndex(classPath);

  await Promise.all(
    Object.keys(ALL_CLASSES_INDEX).map((key) =>initClass(key,editionName,validSources,loadFile))
  );  
}

async function initClass(key,editionName,validSources,loadFile) {
  const file = ALL_CLASSES_INDEX[key];
  const res = await fetch(`./data/class/${file}`);
  const data = await res.json();
  loadFile(data,editionName,validSources,loadFile);
}

async function loadClassesIndex(dataPath) {
  const res = await fetch("./"+dataPath+"/class/index.json");
  return await res.json();
}

