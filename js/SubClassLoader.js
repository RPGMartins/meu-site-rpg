var subClassListID = "subClassSection";
var subClassInfoID = "subClassInfo"
let subClassButtons = []; // { subcls, btn }
var selectedSubClass = null;

function CleanSubClass() {
  CleanContainer(subClassListID);
  CleanContainer(subClassInfoID);

  subClassButtons = [];
  selectedSubClassBtn = null;
}
function RenderSubClassList(subclasses) {
  CleanSubClass();

  if (!subclasses || subclasses.length === 0) return;

  const container = document.getElementById(subClassListID);

  OrganizeSubclasses(subclasses).forEach(sc => {
    const btn = document.createElement("button");
    btn.textContent = sc.name;
    btn.style.display = "block";

    clearSubClassButton(btn);

    btn.onclick = () => onSubClassClicked(sc, btn);

    container.appendChild(btn);
    subClassButtons.push({ subcls: sc, btn });
  });

  syncSubClassButtonsFromState();
}
function onSubClassClicked(subcls, btn) {
  CleanContainer(subClassInfoID);

  // Toggle off
  if (
    CharacterState.subclass &&
    CharacterState.subclass.name === subcls.name &&
    CharacterState.subclass.source === subcls.source
  ) {
    CharacterState.subclass = null;
    ClearAllBackgroundButtonsSubClass();
    UpdateClassHeader();
    return;
  }

  CharacterState.subclass = subcls;

  ClearAllBackgroundButtonsSubClass();
  markSubClassButton(btn);
  selectedSubClassBtn = btn;

  renderSubClassDetails(subcls);
  UpdateClassHeader();
}
function renderSubClassDetails(subcls) {
  CleanContainer(subClassInfoID);

  let subclass;
  let source = "One";

  if (subcls.classic) {
    subclass = subcls.classic;
    source = subclass.source;
  } else {
    subclass = subcls.one;
  }

  const div = document.createElement("div");
  div.style.marginTop = "20px";
  div.innerHTML = `
    <h3>${subcls.name}</h3>
    <p><strong>Fonte:</strong> ${Parser.sourceJsonToAbv(source)}</p>
  `;

  document.getElementById(subClassInfoID).appendChild(div);
}
function clearSubClassButton(btn) {
  if (!btn) return;
  btn.style.backgroundColor = "LightGray";
}
function markSubClassButton(btn) {
  if (!btn) return;
  btn.style.backgroundColor = "green";
}
function ClearAllBackgroundButtonsSubClass() {
  subClassButtons.forEach(({ btn }) => clearSubClassButton(btn));
  selectedSubClassBtn = null;
}
function syncSubClassButtonsFromState() {
  if (!CharacterState.subclass) {
    ClearAllBackgroundButtonsSubClass();
    return;
  }

  subClassButtons.forEach(({ subcls, btn }) => {
    if (
      subcls.name === CharacterState.subclass.name &&
      subcls.source === CharacterState.subclass.source
    ) {
      markSubClassButton(btn);
      selectedSubClassBtn = btn;
    } else {
      clearSubClassButton(btn);
    }
  });
}

function OrganizeSubclasses(subclasses) {
  const map = new Map();

  subclasses.forEach(sc => {
    if (sc._copy) return;

    const key = `${sc.name}|${sc.className}`;

    if (!map.has(key)) {
      map.set(key, {
        name: sc.name,
        className: sc.className,
        classic: null,
        one: null
      });
    }

    if (sc.edition === "one") {
      map.get(key).one = sc;
    } else {
      map.get(key).classic = sc;
    }
  });

  return [...map.values()];
}
