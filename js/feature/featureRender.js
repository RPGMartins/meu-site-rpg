import { CharacterState } from "../state/characterState.js";
import {
  getClassFeatures,
  getSubclassFeatures,
  getRaceFeatures,
  getSubraceFeatures,
  getBackground
} from "../data/dataRegistry.js";

/* =========================================================
 * MAIN RENDER
 * ======================================================= */
export function renderFeatureOverlay() {

  const classFeatures = getClassFeatures(
    CharacterState.generalClass.class,
    CharacterState.generalClass.edition,
    CharacterState.generalClass.source
  );

  const subclassFeatures = getSubclassFeatures(
    CharacterState.generalClass.class,
    CharacterState.generalClass.edition,
    CharacterState.generalClass.source,
    CharacterState.generalClass.subclass
  );

  const raceFeatures = getRaceFeatures(
    CharacterState.generalRace.race,
    CharacterState.generalRace.edition,
    CharacterState.generalRace.source
  );

  const subraceFeatures = getSubraceFeatures(
    CharacterState.generalRace.race,
    CharacterState.generalRace.edition,
    CharacterState.generalRace.source,
    CharacterState.generalRace.subRace
  );

  const background = getBackground(
    CharacterState.generalBackground.edition,
    CharacterState.generalBackground.source,
    CharacterState.generalBackground.background
  );

  const feats = CharacterState.generalFeats.feats ?? [];

  /* ─────────────────────────────────────────
   * COLUNA 1 — CLASS FEATURES (INDEX)
   * ─────────────────────────────────────── */
  renderFeatureList({
    container: document.getElementById("classFeatureList"),
    features: classFeatures,
    isSelected: i =>
      CharacterState.generalPrint.classFeatures.includes(i),
    onToggle: i =>
      toggleIndexInArray(CharacterState.generalPrint.classFeatures, i)
  });

  /* ─────────────────────────────────────────
   * COLUNA 2 — SUBCLASS + RACE (INDEX)
   * ─────────────────────────────────────── */
  renderFeatureList({
    container: document.getElementById("subclassFeatureList"),
    features: [...subclassFeatures, ...raceFeatures, ...subraceFeatures],
    isSelected: i =>
      CharacterState.generalPrint.subclassFeatures.includes(i),
    onToggle: i =>
      toggleIndexInArray(CharacterState.generalPrint.subclassFeatures, i)
  });

  const hasFeats = feats.length > 0;

  const middleTitle = document.getElementById("middleTitle");
  const rightTitle  = document.getElementById("rightTitle");

  /* ─────────────────────────────────────────
   * COM FEATS
   * ─────────────────────────────────────── */
  if (hasFeats) {
    middleTitle.textContent = "Subclass & Race";
    rightTitle.textContent  = "Background & Feats";

    /* Background (single choice) */
    renderSingleChoice({
      container: document.getElementById("backgroundFeatureList"),
      item: background,
      isSelected: key =>
        CharacterState.generalPrint.background === key,
      onSelect: key => {
        CharacterState.generalPrint.background =
          CharacterState.generalPrint.background === key ? null : key;
      }
    });

    /* Feats (KEY BASED) */
    renderFeatureList({
      container: document.getElementById("featFeatureList"),
      features: feats,
      getKey: feat => feat,
      isSelected: key =>
        !!CharacterState.generalPrint.feats[key],
      onToggle: key => {
        CharacterState.generalPrint.feats[key]
          ? delete CharacterState.generalPrint.feats[key]
          : CharacterState.generalPrint.feats[key] = true;
      }
    });

  /* ─────────────────────────────────────────
   * SEM FEATS → background vai pra terceira
   * ─────────────────────────────────────── */
  } else {
    middleTitle.textContent = "Subclass & Race";
    rightTitle.textContent  = "Background";

    renderSingleChoice({
      container: document.getElementById("featFeatureList"),
      item: background,
      isSelected: key =>
        CharacterState.generalPrint.background === key,
      onSelect: key => {
        CharacterState.generalPrint.background =
          CharacterState.generalPrint.background === key ? null : key;
      }
    });
  }
}

/* =========================================================
 * GENERIC FEATURE LIST
 * ======================================================= */
function renderFeatureList({
  container,
  features,
  isSelected,
  onToggle,
  getKey
}) {
  if (!container) return;

  container.innerHTML = "";

  features.forEach((feature, index) => {
    const key = getKey ? getKey(feature, index) : index;

    const li = document.createElement("li");
    li.textContent =
      feature.name ?? feature.title ?? feature;

    if (isSelected(key)) {
      li.classList.add("selected");
    }

    li.addEventListener("click", () => {
      onToggle(key);
      li.classList.toggle("selected");
    });

    container.appendChild(li);
  });
}

/* =========================================================
 * SINGLE CHOICE (BACKGROUND)
 * ======================================================= */
export function renderSingleChoice({
  container,
  item,
  isSelected,
  onSelect
}) {
  if (!container || !item) return;

  container.innerHTML = "";

  const key = item.key ?? item.name;

  const el = document.createElement("div");
  el.className = "feature-item";
  el.textContent = item.name;

  if (isSelected(key)) {
    el.classList.add("selected");
  }

  el.addEventListener("click", () => {
    onSelect(key);
    el.classList.toggle("selected");
  });

  container.appendChild(el);
}

/* =========================================================
 * UTILS
 * ======================================================= */
function toggleIndexInArray(arr, index) {
  const i = arr.indexOf(index);
  if (i === -1) arr.push(index);
  else arr.splice(i, 1);
}
