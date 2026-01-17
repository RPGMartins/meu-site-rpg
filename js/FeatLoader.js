let FeatCache = null;

var featControlsID = "featControls";
var featListID     = "featContainer";

let ALL_FEATS = [];
let featButtons = [];

(
    async function initFeatLoader() 
    {
        ALL_FEATS = await loadAllFeats();
        renderFeatCategories(ALL_FEATS);
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
  featButtons = [];

  const container = document.getElementById(featListID);

  feats.forEach(feat => 
    {
    const btn = document.createElement("button");
    btn.textContent = feat.name;
    btn.style.display = "block";

    clearFeatButton(btn);

    if (isFeatSelected(feat)) {
      markFeatButton(btn);
    }

    btn.onclick = () => toggleFeat(feat, btn);

    container.appendChild(btn);
    featButtons.push({ feat, btn });
  });
}


function toggleFeat(feat, btn) {
  const idx = CharacterState.feats.findIndex(f =>
    f.name === feat.name && f.source === feat.source
  );

  if (idx >= 0) {
    CharacterState.feats.splice(idx, 1);
    clearFeatButton(btn);
  } else {
    CharacterState.feats.push({
      name: feat.name,
      source: feat.source,
    });
    markFeatButton(btn);
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

function clearFeatButton(btn) {
  if (!btn) return;
  btn.style.backgroundColor = "LightGray";
}

function markFeatButton(btn) {
  if (!btn) return;
  btn.style.backgroundColor = "green";
}

function ClearAllBackgroundButtonsFeats() 
{
  featButtons.forEach(({ feat, btn }) => 
    {
      clearFeatButton(btn);

  });
}
