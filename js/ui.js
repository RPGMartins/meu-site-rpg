function toggleSection(sectionBodyId) {
  const body = document.getElementById(sectionBodyId);
  if (!body) return;

  const section = body.closest(".section");
  if (!section) return;

  section.classList.toggle("open");
}
