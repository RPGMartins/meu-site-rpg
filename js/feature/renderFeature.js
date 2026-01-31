import {renderFeatures} from "../Selection/baseOverlay.js";

export function renderFeatureSection({sourceType,sourceName,entries}) {
    if (!entries || !entries.length) return "";

    return `
    <section class="feature-section">
      <h2 class="feature-section-title">
        ${sourceType} – ${sourceName}
      </h2>

      ${renderFeatures(entries)}
    </section>
  `;
}
