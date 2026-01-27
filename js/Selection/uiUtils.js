import { getSourceDisplayName } from "../data/sourceNames.js";

export function fillSelect(  select,  options,  placeholder = "— Escolha —",  labelResolver = null) {
  select.innerHTML = "";

  // placeholder
  const opt = document.createElement("option");
  opt.value = "";
  opt.textContent = placeholder;
  select.appendChild(opt);

  if (!Array.isArray(options) || options.length === 0) {
    select.disabled = true;
    return;
  }

  options.forEach(option => {
    const o = document.createElement("option");

    // value interno
    o.value = String(option);

    // texto exibido
    if (typeof labelResolver === "function") {
      o.textContent = labelResolver(option);
    } else if (typeof option === "object") {
      // fallback defensivo
      o.textContent = option.label ?? option.value ?? String(option);
    } else {
      o.textContent = String(option);
    }

    select.appendChild(o);
  });

  select.disabled = false;
}
