import { CharacterState } from "./characterState.js";


export function downloadCharacterState() {
  const data = JSON.stringify(CharacterState, null, 2);

  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "character.json";
  a.click();

  URL.revokeObjectURL(url);
}


export function uploadCharacterState() {
  return new Promise((resolve, reject) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";

    input.onchange = async () => {
      const file = input.files[0];
      if (!file) {
        resolve(null);
        return;
      }

      try {
        const text = await file.text();
        const data = JSON.parse(text);
        resolve(data);
      } catch (err) {
        reject(err);
      }
    };

    input.click();
  });
}

