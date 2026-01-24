import { parse5eText } from "./parse5eText.js";

export function render5e(input) {
  if (!input) return "";

  if (Array.isArray(input)) {
    return input.map(node => renderNode(node)).join("");
  }

  return renderNode(input);
}

function renderNode(node) {
  if (!node) return "";
  /* =========================
   * STRING
   * ========================= */
  if (typeof node === "string") {
    return `<p>${parse5eText(node)}</p>`;
  }

  /* =========================
   * FEATURE (name + entries)
   * ========================= */
  if (node.entries && typeof node.name === "string" && node.name.trim()) {
    const title =
      node.level !== undefined
        ? `Level ${node.level}: ${node.name}`
        : node.name;

    return `
      <details class="class-feature">
        <summary class="class-feature-title">
          ${title}
        </summary>
        <div class="class-feature-body">
          ${render5e(node.entries)}
        </div>
      </details>
    `;
  }

  /* =========================
   * LISTAS
   * ========================= */
  if (node.type === "list") {

    // LIST-HANG-NOTITLE → vira múltiplas FEATURES
    if (node.style === "list-hang-notitle") {
      return node.items.map(item => `
        <details class="class-feature">
          <summary class="class-feature-title">
            ${item.name?.replace(/:$/, "") ?? ""}
          </summary>
          <div class="class-feature-body">
            ${renderListItemContent(item)}
          </div>
        </details>
      `).join("");
    }

    // LISTA NORMAL
    return `
      <ul>
        ${node.items.map(item => `
          <li>
            ${
              typeof item === "string"
                ? parse5eText(item)
                : `
                  ${item.name ? `<strong>${item.name}</strong> ` : ""}
                  ${renderListItemContent(item)}
                `
            }
          </li>
        `).join("")}
      </ul>
    `;
  }

  /* =========================
   * TABELA
   * ========================= */
  if (node.type === "table") {
    return renderTable(node);
  }

  /* =========================
   * FALLBACK (entries soltos)
   * ========================= */
  if (node.entries) {
    return render5e(node.entries);
  }

  return "";
}

/* =========================
 * HELPERS
 * ========================= */

function renderTable(table) {
  return `
    <table class="feature-table">
      <thead>
        <tr>
          ${table.colLabels.map(h => `<th>${h}</th>`).join("")}
        </tr>
      </thead>
      <tbody>
        ${table.rows.map(row => `
          <tr>
            ${row.map(cell => `<td>${parse5eText(cell)}</td>`).join("")}
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

function renderListItemContent(item) {
  if (typeof item.entry === "string") {
    return parse5eText(item.entry);
  }

  if (Array.isArray(item.entries)) {
    return render5e(item.entries);
  }

  return "";
}
