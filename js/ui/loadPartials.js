export async function loadPartial(containerId, path) {
  const res = await fetch(path);
  const html = await res.text();
  document.getElementById(containerId).insertAdjacentHTML("beforeend", html);
}
