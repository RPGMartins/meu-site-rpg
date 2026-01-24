let ALL_RACES_INDEX = null;

export async function initRaceLoader(racePath,editionName,validSources,loadFile) {
  const data = await loadRacesFile(racePath);
  loadFile(data, editionName, validSources);
}

async function loadRacesFile(racePath) {
  const res = await fetch(`./${racePath}/races.json`);
  return await res.json();
}