let FeatCache = null;

var featControlsID = "featControls";
var featListID     = "featContainer";

(
    async function initFeatLoader() 
    {
        const feats = await loadAllFeats();
        renderFeatCategories(feats);
    }
)();

async function loadAllFeats() {
  if (FeatCache) return FeatCache;

  const res = await fetch("./data/feats.json");
  const json = await res.json();

  FeatCache = json.feat;
  return FeatCache;
}

function renderFeatCategories(feats) {
  CleanContainer(featControlsID);

  const generalFeats = feats.filter(isGeneralFeat);
  renderFeatList(generalFeats);
}


function renderFeatList(feats) {
  CleanContainer(featListID);

  feats.forEach(feat => {

    const btn = document.createElement("button");
    btn.textContent = feat.name;
    btn.style.display = "block";

    if (isFeatSelected(feat)) 
    {
      btn.classList.add("selected");
    }

    btn.onclick = () => toggleFeat(feat,btn);
    btn.style.backgroundColor = "LightGray";

    document.getElementById(featListID).appendChild(btn);
  });
}

function toggleFeat(feat,btn) 
{
  const idx = CharacterState.feats.findIndex(f =>
    f.name === feat.name && f.source === feat.source
  );

  if (idx >= 0) 
  {
    CharacterState.feats.splice(idx, 1);
    btn.style.backgroundColor = "LightGray";

  } 
  else 
    {
      btn.style.backgroundColor = "green";
      CharacterState.feats.push({
      name: feat.name,
      source: feat.source,
    });
  }

  UpdateFeatHeader();
}

function isFeatSelected(feat) {
  return CharacterState.feats.some(f =>
    f.name === feat.name && f.source === feat.source
  );
}

function isGeneralFeat(feat) {
  // Remove sistemas de classe (Fighting Style, Invocation, etc)
  if (feat.category) return false;

  // Remove feats raciais / especiais
  if (feat.raceName) return false;
  if (feat.origin) return false;

  // Remove coisas estranhas que não são escolhas normais
  if (feat.ability) return false;

  return true;
}
