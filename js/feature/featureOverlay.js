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
     * Aqui você decide como mapear para {{ }}
     * Exemplo simples:
     */
    const templateData = {
      classeNivel: printable.classBase?.name ?? "",
      subclasseNome: printable.subClassBase?.name ?? "",
      racaNome: printable.raceBase?.name ?? "",
      antecedenteNome: printable.bgBase?.name ?? "",

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
 * DOWNLOAD
 * ======================================================= */
async function downloadSheet(data) {
  const html = await loadSheetTemplate();
  const finalHtml = applyTemplate(html, data);
  forceDownload(finalHtml, "ficha.html");
}

function applyTemplate(html, data) {
  return html.replace(/{{\s*(\w+)\s*}}/g, (_, key) =>
  {
    return key in data ? data[key] : "";
  });
}

async function loadSheetTemplate() {
  const res = await fetch("../partials/sheet.html");
  return await res.text();
}

function forceDownload(content, filename) {
  const blob = new Blob([content], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
