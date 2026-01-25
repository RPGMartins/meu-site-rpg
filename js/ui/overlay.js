let overlay;
let closeBtn;
let overlayTitle;
let overlayBody;

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
  overlay = document.getElementById("classOverlay");
  closeBtn = document.getElementById("closeClassOverlay");
  overlayTitle = document.getElementById("overlayTitle");
  overlayBody = document.getElementById("overlayBody");
  
  closeBtn.addEventListener("click", closeClassOverlay);

  
  // Fecha clicando fora
  overlay.addEventListener("click", e => {
    if (e.target === overlay) closeClassOverlay();
  });
}