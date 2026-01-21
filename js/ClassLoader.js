import {registerClassFile , getAvailableClassEditions, getAvailableClassSources, getAvailableSubclasses} from "./data/dataRegistry.js"

let ALL_CLASSES_INDEX = null;

export  async function initClassLoader() {

  ALL_CLASSES_INDEX = await loadClassesIndex();
  Object.keys(ALL_CLASSES_INDEX).forEach(classIndex => {
    initClass(classIndex);
  });}

async function initClass(key) {
  const file = ALL_CLASSES_INDEX[key];
  const res = await fetch(`./data/class/${file}`);
  const data = await res.json();
  registerClassFile(data);
}

async function loadClassesIndex() {
  const res = await fetch("./data/class/index.json");
  return await res.json();
}

