import { getSourceDisplayName } from "../data/sourceNames.js";

export function fillSelect(select, options, placeholder = "— Escolha —") {
  select.innerHTML = "";

  const opt = document.createElement("option");
  opt.value = "";
  opt.textContent = placeholder;
  select.appendChild(opt);

  options.forEach(option => {
    const o = document.createElement("option");

    // Caso antigo: string simples
    if (typeof option === "string") {
      o.value = option;
      o.textContent = option;
    }
    // Caso novo: objeto { value, label }
    else {
      o.value = option.value;
      o.textContent = option.label;
    }

    select.appendChild(o);
  });

  select.disabled = options.length === 0;
}
