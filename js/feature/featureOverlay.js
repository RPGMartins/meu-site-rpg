import { renderFeatureOverlay } from "./featureRender.js";
import { resolvePrintableFeatures } from "./featurePrint.js";
import { CharacterState } from "../state/characterState.js";
import { renderFeatureSection } from "./renderFeature.js";

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
    // 🔑 ABRE A ABA IMEDIATAMENTE (CRÍTICO PARA MOBILE)
    const popup = window.open("about:blank", "_blank");

    if (!popup) {
      alert("Permita popups para gerar a ficha.");
      return;
    }

    try {
      const printable = resolvePrintableFeatures();
      const profs = getAllProficiencies(printable);

      let subraceName = "";
      if (printable.subRaceBase) {
        subraceName = printable.subRaceBase.name;
      }

      /* =========================================================
       * FEATURE HTML
       * ======================================================= */
      let classFeaturesHtml = "";
      if (
          printable.classBase?.name &&
          Array.isArray(printable.classFeatures) &&
          printable.classFeatures.length
      ) {
        classFeaturesHtml = renderFeatureSection({
          sourceType: "Classe",
          sourceName: printable.classBase.name,
          entries: printable.classFeatures
        });
      }

      let subClassFeaturesHtml = "";
      if (
          printable.subClassBase?.name &&
          Array.isArray(printable.subclassFeatures) &&
          printable.subclassFeatures.length
      ) {
        subClassFeaturesHtml = renderFeatureSection({
          sourceType: "Subclasse",
          sourceName: printable.subClassBase.name,
          entries: printable.subclassFeatures
        });
      }

      let raceFeaturesHtml = "";
      if (
          printable.raceBase?.race?.name &&
          Array.isArray(printable.raceFeatures) &&
          printable.raceFeatures.length
      ) {
        raceFeaturesHtml = renderFeatureSection({
          sourceType: "Race",
          sourceName:
              printable.raceBase.race.name +
              (subraceName ? ` (${subraceName})` : ""),
          entries: printable.raceFeatures
        });
      }

      let bgFeaturesHtml = "";
      if (
          printable.bgBase?.name &&
          Array.isArray(printable.bgFeatures) &&
          printable.bgFeatures.length
      ) {
        bgFeaturesHtml = renderFeatureSection({
          sourceType: "Background",
          sourceName: printable.bgBase.name,
          entries: printable.bgFeatures
        });
      }

      let featFeaturesHtml = renderFeatureSection({
        sourceType: "Feat",
        sourceName: "",
        entries: printable.featFeatures
      });

      /* =========================================================
       * TEMPLATE DATA
       * ======================================================= */
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

        proficienciasArmas: profs.weapons.map(proficiencyToString).filter(Boolean).join(","),
        proficienciasArmaduras: profs.armor.map(proficiencyToString).filter(Boolean).join(","),
        proficienciasFerramentas: profs.tools.map(proficiencyToString).filter(Boolean).join(","),
        idiomas: profs.languages.map(proficiencyToString).filter(Boolean).join(","),

        outrasProficiencias: [
          ...mapWithPrefix(profs.skills),
          ...mapWithPrefix(profs.resistances, "R "),
          ...mapWithPrefix(profs.immunities, "I "),
          ...mapWithPrefix(profs.other)
        ].join(", "),

        classFeaturesHtml,
        subClassFeaturesHtml,
        raceFeaturesHtml,
        bgFeaturesHtml,
        featFeaturesHtml
      };

      // ⬇️ passa a aba aberta
      await downloadSheet(templateData, printable.classBase, popup);

    } catch (err) {
      popup.close();
      console.error(err);
      alert("Erro ao gerar a ficha.");
    }
  };
}

/* =========================================================
 * DOWNLOAD PIPELINE
 * ======================================================= */
async function downloadSheet(data, classBase, popup) {
  const { html, css } = await loadSheetAssets();

  let finalHtml = inlineCss(html, css);
  finalHtml = applySavingThrowProficiencies(finalHtml, classBase);
  finalHtml = applyTemplate(finalHtml, data);

  const blob = new Blob([finalHtml], {
    type: "text/html;charset=utf-8"
  });

  const url = URL.createObjectURL(blob);

  // 🔑 ISSO é o que funciona no mobile
  popup.location.href = url;

  // limpa depois (não imediatamente!)
  setTimeout(() => URL.revokeObjectURL(url), 30_000);
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
    fetch(new URL("../../partials/sheet.html", import.meta.url)),
    fetch(new URL("../../css/sheet.css", import.meta.url))
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
 * PROFICIENCY RESOLVER
 * Agrega proficiências vindas de:
 * classe, subclasse, raça, subraça, background e feats
 * ======================================================= */

export function getAllProficiencies(printable) {
  const result = createEmptyProficiencySet();

  collectFromClass(printable.classBase, result);
  collectFromSubclass(printable.subClassBase, result);
  collectFromRace(printable.raceBase?.race, result);
  collectFromSubrace(printable.subRaceBase?.subrace, result);
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

function proficiencyToString(value) {
  if (!isPrintableProficiency(value)) return null;

  if (typeof value === "string") {
    return value
        .replace(/\{@item\s+/g, "")
        .replace(/\|[^}]+\}/g, "")
        .trim();
  }

  if (typeof value === "object" && value?.proficiency) {
    return value.proficiency;
  }

  return null;
}

function isPrintableProficiency(value) {
  if (typeof value !== "string") return true;

  const lowered = value.toLowerCase();

  return !(
      lowered.includes("of your choice") ||
      lowered.includes("choose") ||
      lowered.includes("any ") ||
      lowered.includes("one ") ||
      lowered.includes("two ") ||
      lowered.includes("three ")
  );
}

function clean5eTag(str) {
  if (typeof str !== "string") return "";

  // remove {@item , {@spell , {@tool , etc
  if (!str.startsWith("{@")) return str;

  // remove {@xxx
  let text = str.replace(/^\{@\w+\s+/, "");

  // corta tudo depois do primeiro |
  text = text.split("|")[0];

  // remove }
  text = text.replace(/}$/, "");

  return text.trim();
}

function mapWithPrefix(arr, prefix = "") {
  if (!Array.isArray(arr)) return [];

  return arr
      .map(v => {
        const text = proficiencyToString(v);
        return text ? prefix + text : null;
      })
      .filter(Boolean);
}
function cleanInlineText(text) {
  if (typeof text !== "string") return "";

  return text
      .replace(/\{@[^}]+\}/g, "")
      .replace(/\s+/g, " ")
      .trim();
}

function cleanName(name) {
  if (typeof name !== "string") return "";
  return name.split("|")[0].trim();
}

function renderClassFeaturesHtml(features = []) {
  return features
      .slice()
      .sort((a, b) => {
        if (a.level == null && b.level == null) return 0;
        if (a.level == null) return 1;
        if (b.level == null) return -1;
        return a.level - b.level;
      })
      .map(feature => {

        const source = feature.sourceType ?? "";
        const hasLevel = typeof feature.level === "number";

        const title = hasLevel
            ? `${source} – ${feature.level}º nível – ${feature.name}`
            : `${source} – ${feature.name}`;

        const entriesText = entryToText(feature.entries);

        const entriesHtml = entriesText
            .split("\n")
            .map(p => `<p>${p}</p>`)
            .join("");

        return `
        <div class="feature-block">
          <div class="feature-title">
            ${title}
          </div>
          <div class="feature-text">
            ${entriesHtml}
          </div>
        </div>
      `;
      })
      .join("");
}


