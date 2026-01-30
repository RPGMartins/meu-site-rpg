import { renderFeatureOverlay } from "./featureRender.js";
import { resolvePrintableFeatures } from "./featurePrint.js";
import { CharacterState } from "../state/characterState.js";

/* =========================================================
 * OPEN / CLOSE OVERLAY
 * ======================================================= */
export function openFeatureOverlay() {
  const overlay = document.getElementById("featureOverlay");
  renderFeatureOverlay();
  overlay.classList.remove("hidden");
}

export function closeFeatureOverlay() {
  document
      .getElementById("featureOverlay")
      .classList.add("hidden");
}

/* =========================================================
 * INIT
 * ======================================================= */
export function initFeatureOverlay() {
  const btn = document.getElementById("btnCreateSheet");
  if (!btn) return;

  btn.onclick = async () => {

    const printable = resolvePrintableFeatures();

    const profs = getAllProficiencies(printable);

    const templateData = {
      classeNivel:
          `${printable.classBase?.name ?? ""}` +
          (printable.subClassBase ? ` (${printable.subClassBase.name})` : ""),

      raca:
          `${printable.raceBase?.race?.name ?? ""}` +
          (printable.raceBase?.subraces?.[CharacterState.generalRace.subRace]
              ? ` (${printable.raceBase.subraces[CharacterState.generalRace.subRace].name})`
              : ""),

      antecedente: printable.bgBase?.name ?? "",
      vida: printable.classBase?.hd ? `d${printable.classBase.hd.faces}` : "",

      classFeatures: printable.classFeatures
          .map(f => f.name)
          .join("\n"),

      subclassFeatures: printable.subclassFeatures
          .map(f => f.name)
          .join("\n"),

      featFeatures: printable.featFeatures
          .map(f => f.featName)
          .join("\n")
    };

    await downloadSheet(templateData, printable.classBase);
  };
}

/* =========================================================
 * DOWNLOAD PIPELINE
 * ======================================================= */
async function downloadSheet(data, classBase) {
  const { html, css } = await loadSheetAssets();

  let finalHtml = inlineCss(html, css);

  finalHtml = applySavingThrowProficiencies(finalHtml, classBase);
  finalHtml = applyTemplate(finalHtml, data);

  forceDownload(finalHtml, "ficha.html");
}

/* =========================================================
 * TEMPLATE
 * ======================================================= */
function applyTemplate(html, data) {
  return html.replace(/{{\s*(\w+)\s*}}/g, (_, key) =>
      key in data ? data[key] : ""
  );
}

/* =========================================================
 * LOAD HTML + CSS
 * ======================================================= */
async function loadSheetAssets() {
  const [htmlRes, cssRes] = await Promise.all([
    fetch("../partials/sheet.html"),
    fetch("../css/sheet.css")
  ]);

  return {
    html: await htmlRes.text(),
    css: await cssRes.text()
  };
}

/* =========================================================
 * INLINE CSS
 * ======================================================= */
function inlineCss(html, css) {
  html = html.replace(
      /<link[^>]+rel=["']stylesheet["'][^>]*>/i,
      ""
  );

  return html.replace(
      "</head>",
      `<style>\n${css}\n</style>\n</head>`
  );
}

/* =========================================================
 * APPLY SAVING THROW PROFICIENCIES (STRING BASED)
 * ======================================================= */
function applySavingThrowProficiencies(html, classBase) {
  if (!classBase?.proficiency?.length) return html;

  classBase.proficiency.forEach(ability => {
    const regex = new RegExp(
        `(data-ability=["']${ability}["'][\\s\\S]*?<input[^>]*class=["']save-prof["'][^>]*)(>)`,
        "i"
    );

    html = html.replace(regex, `$1 checked$2`);
  });

  return html;
}

/* =========================================================
 * FORCE DOWNLOAD
 * ======================================================= */
function forceDownload(content, filename) {
  const blob = new Blob([content], {
    type: "text/html;charset=utf-8"
  });

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;

  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* =========================================================
 * PROFICIENCY RESOLVER
 * Agrega proficiências vindas de:
 * classe, subclasse, raça, subraça, background e feats
 * ======================================================= */

export function getAllProficiencies(printable) {
  const result = createEmptyProficiencySet();

  collectFromClass(printable.classBase, result);
  collectFromSubclass(printable.subClassBase, result);
  collectFromRace(printable.raceBase.race, result);
  collectFromSubrace(printable.subRaceBase.subrace, result);
  collectFromBackground(printable.bgBase, result);
  collectFromFeats(printable.featFeatures, result);

  return normalizeResult(result);
}

/* =========================================================
 * BASE STRUCTURE
 * ======================================================= */

function createEmptyProficiencySet() {
  return {
    armor: new Set(),
    weapons: new Set(),
    tools: new Set(),
    skills: new Set(),
    languages: new Set(),
    resistances: new Set(),
    immunities: new Set(),
    other: new Set()
  };
}

/* =========================================================
 * CLASS / SUBCLASS
 * ======================================================= */

function collectFromClass(classBase, out) {
  if (!classBase?.startingProficiencies) return;

  const sp = classBase.startingProficiencies;

  sp.armor?.forEach(a => out.armor.add(a));
  sp.weapons?.forEach(w => out.weapons.add(w));
  sp.tools?.forEach(t => out.tools.add(t));
  sp.skills?.forEach(s => out.skills.add(s));
}

function collectFromSubclass(subClassBase, out) {
  if (!subClassBase) return;

  // Algumas subclasses têm proficiências diretas
  if (subClassBase.startingProficiencies) {
    collectFromClass(subClassBase, out);
  }

  // Resistências explícitas
  subClassBase.resist?.forEach(r => out.resistances.add(r));
  subClassBase.immune?.forEach(i => out.immunities.add(i));
}

/* =========================================================
 * RACE / SUBRACE
 * ======================================================= */

function collectFromRace(raceBase, out) {
  if (!raceBase) return;

  // Idiomas
  raceBase.languageProficiencies?.forEach(langObj => {
    Object.keys(langObj).forEach(lang => {
      if (langObj[lang] === true) {
        out.languages.add(lang);
      }
    });
  });

  // Resistências / imunidades
  raceBase?.resist?.forEach(r => out.resistances.add(r));
  raceBase?.immune?.forEach(i => out.immunities.add(i));
}

function collectFromSubrace(subRaceBase, out) {
  collectFromRace(subRaceBase, out);
}

/* =========================================================
 * BACKGROUND
 * ======================================================= */

function collectFromBackground(bgBase, out) {
  if (!bgBase) return;

  // Skills / Tools
  bgBase.proficiencies?.skills?.forEach(s => out.skills.add(s));
  bgBase.proficiencies?.tools?.forEach(t => out.tools.add(t));

  // Idiomas
  bgBase.languageProficiencies?.forEach(langObj => {
    Object.keys(langObj).forEach(lang => {
      if (langObj[lang] === true) {
        out.languages.add(lang);
      }
    });
  });
}

/* =========================================================
 * FEATS (SAFE MODE)
 * Só campos estruturados
 * ======================================================= */

function collectFromFeats(feats = [], out) {
  feats.forEach(feat => {
    if (!feat) return;

    feat.languageProficiencies?.forEach(langObj => {
      Object.keys(langObj).forEach(lang => {
        if (langObj[lang] === true) {
          out.languages.add(lang);
        }
      });
    });

    feat.resist?.forEach(r => out.resistances.add(r));
    feat.immune?.forEach(i => out.immunities.add(i));
  });
}

/* =========================================================
 * NORMALIZATION
 * Converte Sets → Arrays ordenados
 * ======================================================= */

function normalizeResult(result) {
  const out = {};

  Object.keys(result).forEach(key => {
    out[key] = Array.from(result[key]).sort();
  });

  return out;
}
