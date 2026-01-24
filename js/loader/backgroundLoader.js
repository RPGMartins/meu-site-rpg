export async function initBackgroundLoader(bgPath, editionName, validSources, loadFile) {
  const data = await loadBackgroundFile(bgPath);
  loadFile(data, editionName, validSources);
}

async function loadBackgroundFile(bgPath) {
  const res = await fetch(`./${bgPath}/backgrounds.json`);
  return await res.json();
}
