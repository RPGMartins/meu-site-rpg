export async function initFeatLoader(dataPath, editionName, validSources, loadFile) {
  const data = await loadFeatFile(dataPath);
  loadFile(data, editionName, validSources);
}

async function loadFeatFile(dataPath) {
  const res = await fetch(`./${dataPath}/feats.json`);
  return await res.json();
}
