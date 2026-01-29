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

    /*
     * Mapeamento dos {{ }}
     * Ajuste livremente conforme a ficha crescer
     */
    const templateData = {
      classeNivel: printable.classBase?.name +" ("+ printable.subClassBase?.name + ")" ?? "",
      raca: printable.raceBase?.race?.name +" ("+ printable.raceBase?.subraces[CharacterState?.generalRace?.subRace]?.name + ")" ?? "",
      antecedente: printable.bgBase?.name ?? "",
      vida: "d"+printable.classBase?.hd.faces ?? "",

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

    await downloadSheet(templateData);
  };
}

/* =========================================================
 * DOWNLOAD PIPELINE
 * ======================================================= */
async function downloadSheet(data) {
  const { html, css } = await loadSheetAssets();

  const htmlWithCss = inlineCss(html, css);
  const finalHtml   = applyTemplate(htmlWithCss, data);

  forceDownload(finalHtml, "ficha.html");
}

/* =========================================================
 * TEMPLATE
 * ======================================================= */
function applyTemplate(html, data) {
  return html.replace(/{{\s*(\w+)\s*}}/g, (_, key) => {
    return key in data ? data[key] : "";
  });
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
  // remove <link rel="stylesheet">
  html = html.replace(
      /<link[^>]+rel=["']stylesheet["'][^>]*>/i,
      ""
  );

  // injeta o css dentro do <head>
  return html.replace(
      "</head>",
      `<style>\n${css}\n</style>\n</head>`
  );
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
