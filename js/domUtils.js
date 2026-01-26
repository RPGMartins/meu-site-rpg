export async function waitAllElements() {
  await waitForElements([
    "bgSourceSelect",
    "classSelect",
    "featSourceSelect",
    "raceSourceSelect"
  ]);
}
export function waitForElements(ids) {
  return Promise.all(ids.map(id => waitForElement(id)));
}

export function waitForElement(id) {
  return new Promise(resolve => {
    const el = document.getElementById(id);
    if (el) return resolve(el);

    const obs = new MutationObserver(() => {
      const el = document.getElementById(id);
      if (el) {
        obs.disconnect();
        resolve(el);
      }
    });

    obs.observe(document.body, { childList: true, subtree: true });
  });
}
