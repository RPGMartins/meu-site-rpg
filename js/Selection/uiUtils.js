export function fillSelect(select, options, placeholder = "— Escolha —") {
  select.innerHTML = "";

  const opt = document.createElement("option");
  opt.value = "";
  opt.textContent = placeholder;
  select.appendChild(opt);

  options.forEach(value => {
    const o = document.createElement("option");
    o.value = value;
    o.textContent = value;
    select.appendChild(o);
  });

  select.disabled = options.length === 0;
}