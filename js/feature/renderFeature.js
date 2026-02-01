import { renderFeatures } from "../Selection/baseOverlay.js";

/* =========================
   SECTION
========================= */
export function renderFeatureSection({ sourceType, sourceName, entries, meta }) {
    if (!entries?.length) return "";

    return `
    <section class="feature-section">
      <h2 class="feature-section-title">
        ${sourceType} – ${sourceName}
      </h2>

      ${meta ? renderFeatMeta(meta) : ""}
      ${renderFeatures(entries)}
    </section>
  `;
}

/* =========================
   META RENDER
========================= */
export function renderFeatMeta(meta) {
    if (!meta) return "";

    const blocks = [];

    if (meta.prerequisite?.length) {
        blocks.push(`
          <p><strong>Pré-requisito:</strong> ${renderPrerequisite(meta.prerequisite)}</p>
        `);
    }

    if (meta.ability?.length) {
        const abilityText = renderAbility(meta.ability);
        if (abilityText) {
            blocks.push(`<p><strong>Atributo:</strong> ${abilityText}</p>`);
        }
    }

    if (meta.additionalSpells?.length) {
        blocks.push(`
          <p><strong>Magias concedidas:</strong><br>
          ${renderAdditionalSpells(meta.additionalSpells)}
          </p>
        `);
    }

    if (meta.repeatable) {
        blocks.push(`<p><em>Este feat pode ser escolhido mais de uma vez.</em></p>`);
    }

    if (!blocks.length) return "";

    return `<div class="feat-meta">${blocks.join("\n")}</div>`;
}

/* =========================
   META EXTRACT
========================= */
export function extractFeatMeta(feat) {
    if (!feat) return null;

    return {
        prerequisite: feat.prerequisite ?? [],
        ability: feat.ability ?? [],
        additionalSpells: feat.additionalSpells ?? [],
        repeatable: feat.repeatable ?? false
    };
}

/* =========================
   ABILITY
========================= */
function renderAbility(abilityArr) {
    if (!abilityArr.length) return "";

    const entry = abilityArr[0];

    // choose (Athlete, Resilient, etc)
    if (entry.choose) {
        return `+${entry.choose.amount} (${entry.choose.from
            .map(a => a.toUpperCase())
            .join(" ou ")})`;
    }

    // flat bonus (Heavy Armor Master)
    const key = Object.keys(entry)[0];
    if (key) {
        return `+${entry[key]} (${key.toUpperCase()})`;
    }

    return "";
}

/* =========================
   PREREQUISITE
========================= */
function renderPrerequisite(prereqs = []) {
    const parts = [];

    prereqs.forEach(p => {
        if (p.spellcasting) {
            parts.push("Capacidade de conjurar magias");
        }

        if (p.proficiency) {
            p.proficiency.forEach(prof => {
                if (prof.armor) {
                    parts.push(`Proficiência com armadura ${prof.armor}`);
                }
            });
        }

        if (p.level) {
            parts.push(`Nível ${p.level}`);
        }

        if (p.race) {
            const races = p.race.map(r => r.name).join(", ");
            parts.push(`Raça: ${races}`);
        }
    });

    return parts.join(" • ");
}

/* =========================
   ADDITIONAL SPELLS
========================= */
function renderAdditionalSpells(spells = []) {
    return spells.map(block => {
        const className = block.name.replace(" Spells", "");
        const cantrips =
            block.known?._?.[0]?.count ?? 0;

        return `Escolha ${className}: ${cantrips} truques + 1 magia de 1º nível`;
    }).join("<br>");
}
