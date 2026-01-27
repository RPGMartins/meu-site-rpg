import { ALL_CLASSES } from "../data/dataRegistry.js";
import { fillSelect } from "./uiUtils.js";
import { getSourceDisplayName } from "../data/sourceNames.js";
import { classSelected, classEditionSelected, classSourceSelected, subClassSelected} from "../state/characterState.js";

  let classSelect;
  let editionSelect;
  let sourceSelect;
  let subclassSelect;

export function initClassSelection()
{
  classSelect    = document.getElementById("classSelect");
  editionSelect  = document.getElementById("EditionSelect");
  sourceSelect   = document.getElementById("sourceSelect");
  subclassSelect = document.getElementById("subclassSelect");

  editionSelect.addEventListener("change", () => {
    editionSelectedEvent(editionSelect.value);
  });

  sourceSelect.addEventListener("change", () => {
    sourceSelectedEvent(editionSelect.value, sourceSelect.value);
  });

  classSelect.addEventListener("change", () => {
    classSelectedEvent(
      editionSelect.value,
      sourceSelect.value,
      classSelect.value
    );
  });

    subclassSelect.addEventListener("change", () => {
    subClassSelectedEvent(subclassSelect.value);
  });
}

export function initClassUI() {
  const editions = Object.keys(ALL_CLASSES);
  fillSelect(editionSelect, editions);

  fillSelect(sourceSelect, []);
  fillSelect(classSelect, []);
  fillSelect(subclassSelect, []);
}

// ===============================
// LOAD CHARACTER
// ===============================

export function loadCharacter(classGeneral) {
  editionSelect.value = classGeneral.edition;
  editionSelectedEvent(classGeneral.edition);

  sourceSelect.value = classGeneral.source;
  sourceSelectedEvent(classGeneral.edition, classGeneral.source);

  classSelect.value = classGeneral.class;
  classSelectedEvent(classGeneral.edition,classGeneral.source,classGeneral.class);
  
  subclassSelect.value = classGeneral.subclass;
  subClassSelectedEvent(classGeneral.subclass);
}

// ===============================
// HANDLERS
// ===============================

function editionSelectedEvent(edition) {
  fillSelect(sourceSelect, []);
  fillSelect(classSelect, []);
  fillSelect(subclassSelect, []);

  if (!edition) return;

  const sources = Object.keys(ALL_CLASSES[edition] ?? {});

  fillSelect(
    sourceSelect,
    sources,
    "— Fonte —",
    src => `${src} — ${getSourceDisplayName(src)}`
  );

  classEditionSelected(edition);
}


function sourceSelectedEvent(edition, source) {
  fillSelect(classSelect, []);
  fillSelect(subclassSelect, []);

  if (!edition || !source) return;

  const classOption = Object.keys(
    ALL_CLASSES?.[edition]?.[source] ?? {}
  );

  fillSelect(classSelect, classOption);
  classSourceSelected(source);
}

function classSelectedEvent(edition, source, classKey) {
  fillSelect(subclassSelect, []);

  if (!edition || !source || !classKey) return;

  const subclasses =
    ALL_CLASSES?.[edition]?.[source]?.[classKey]?.subclasses;

  fillSelect(subclassSelect, Object.keys(subclasses ?? {}));
  classSelected(classKey);
}

function subClassSelectedEvent(subclassKey) {
  if (!subclassKey) return;
  subClassSelected(subclassKey);
}
