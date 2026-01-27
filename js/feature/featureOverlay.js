import {renderFeatureOverlay } from "./featureRender.js"

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

