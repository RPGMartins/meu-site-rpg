import {registerClassFile ,registerClassFeatures, registerSubclassFeatures} from "./data/dataRegistry.js"

let ALL_CLASSES_INDEX = null;

export  async function initClassLoader() {

  ALL_CLASSES_INDEX = await loadClassesIndex();

  await Promise.all(
    Object.keys(ALL_CLASSES_INDEX).map(initClass)
  );  
}

async function initClass(key) {
  const file = ALL_CLASSES_INDEX[key];
  const res = await fetch(`./data/class/${file}`);
  const data = await res.json();
  

  registerClassFile(data);
  //registerClassFeatures(data.classFeature);
  //registerSubclassFeatures(data.subclassFeature);
}

async function loadClassesIndex() {
  const res = await fetch("./data-2014/class/index.json");
  return await res.json();
}

