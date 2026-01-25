const overlay = document.getElementById("classOverlay");
const closeBtn = document.getElementById("closeClassOverlay");
const overlayTitle = document.getElementById("overlayTitle");
const overlayBody = document.getElementById("overlayBody");

export function openClassOverlay(title, htmlContent) {
  overlayTitle.textContent = title;
  overlayBody.innerHTML = htmlContent;
  overlay.classList.remove("hidden");
}

export function closeClassOverlay() {
  overlay.classList.add("hidden");
  overlayBody.innerHTML = "";
}

export function initOverlay()
{
  closeBtn.addEventListener("click", closeClassOverlay);

  // Fecha clicando fora
  overlay.addEventListener("click", e => {
    if (e.target === overlay) closeClassOverlay();
  });
}