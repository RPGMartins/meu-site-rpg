import {registerClassFile ,registerClassFeatures, registerSubclassFeatures} from "./data/dataRegistry.js"

let ALL_CLASSES_INDEX = null;

export  async function initClassLoader(classPath,editionName,validSources) {

  ALL_CLASSES_INDEX = await loadClassesIndex(classPath);

  await Promise.all(
    Object.keys(ALL_CLASSES_INDEX).map((key) =>initClass(key,editionName,validSources))
  );  
}

async function initClass(key,editionName,validSources) {
  const file = ALL_CLASSES_INDEX[key];
  const res = await fetch(`./data/class/${file}`);
  const data = await res.json();
  

  registerClassFile(data,editionName,validSources);
  //registerClassFeatures(data.classFeature);
  //registerSubclassFeatures(data.subclassFeature);
}

async function loadClassesIndex(dataPath) {
  const res = await fetch("./"+dataPath+"/class/index.json");
  return await res.json();
}

