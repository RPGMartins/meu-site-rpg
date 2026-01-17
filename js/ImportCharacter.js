function importCharacter() {
  if (HasCharacterProgress()) 
    {
      const confirmImport = confirm(
      "Tem certeza que deseja importar?\n\nQualquer progresso não salvo será perdido."
    );

    if (!confirmImport) return;
  }

  const input = document.getElementById("importFileInput");
  input.value = "";
  input.click();

  input.onchange = async () => {
    const file = input.files[0];
    if (!file) return;

    try 
    {
      
      ResetUI();

      const text = await file.text();
      const data = JSON.parse(text);
      ApplyImportedCharacter(data);
    } 
    catch (err) 
    {
      alert("Erro ao importar personagem.");
      console.error(err);
    }
  };
}


function ApplyImportedCharacter(data) {
  if (!data || typeof data !== "object") {
    alert("Arquivo inválido.");
    return;
  }

  // Reset seguro
  CharacterState.class = data.class ?? null;
  CharacterState.subclass = data.subclass ?? null;
  CharacterState.race = data.race ?? null;
  CharacterState.subrace = data.subrace ?? null;
  CharacterState.background = data.background ?? null;
  CharacterState.feats = Array.isArray(data.feats) ? data.feats : [];

  // Atualiza UI
  UpdateClassHeader();
  UpdateRaceHeader();
  UpdateBackgroundHeader();
  UpdateFeatHeader();

  console.log("Personagem importado:", CharacterState);
}

function ResetUI() {
  CleanContainer("classInfo");
  CleanContainer("subClassInfo");
  CleanContainer("raceInfo");
  CleanContainer("backgroundInfo");
  CleanContainer("classSub");
  CleanContainer("raceSub");

  ClearAllBackgroundButtonsBackground();
  ClearAllBackgroundButtonsClass();
  ClearAllBackgroundButtonsFeats();
  ClearAllBackgroundButtonsSubClass();
  ClearAllBackgroundButtonsRaces();
  clearAllRaceUI();

  toggleSection('backgroundSection',false);
  toggleSection('featsSection',false);
  toggleSection('subClassSection',false);
  toggleSection('classSection',false)
  toggleSection('subClassSection',false)
}
