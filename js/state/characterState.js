export const CharacterState = {
    generalClass: {
        class : null,
        edition : null,
        source : null,
        subclass : null,

    },

    generalRace: {
        race : null,
        edition : null,
        source : null,
        subRace : null,
    },

    generalBackground: {
        background : null,
        edition : null,
        source : null,
    },
    
    generalFeats: {
        edition : null,
        source : null,
        feats : [],
    }
}

export function classEditionSelected(classEditionSelection){
    
    CharacterState.generalClass.edition = classEditionSelection;
    CharacterState.generalClass.source = null;
    CharacterState.generalClass.class = null;
    CharacterState.generalClass.subclass = null;

}

export function classSourceSelected(classSourceSelection){

    CharacterState.generalClass.source = classSourceSelection;
    CharacterState.generalClass.class = null;
    CharacterState.generalClass.subclass = null;
}

export function classSelected(classSelection){

    CharacterState.generalClass.class = classSelection;
    CharacterState.generalClass.subclass = null;
}


export function subClassSelected(subclassSelection){

    CharacterState.generalClass.subclass = subclassSelection;
}



export function raceEditionSelected(editionSelected)
{
    CharacterState.generalRace.edition = editionSelected;
    CharacterState.generalRace.source = null;
    CharacterState.generalRace.race = null;
    CharacterState.generalRace.subRace = null;
}

export function raceSourceSelected(sourceSelected)
{

    CharacterState.generalRace.source = sourceSelected;
    CharacterState.generalRace.race = null;
    CharacterState.generalRace.subRace = null;
}

export function raceSelected(raceSelected)
{
    CharacterState.generalRace.race = raceSelected;
    CharacterState.generalRace.subRace = null;
}

export function subRaceSelected(subRaceSelected)
{
    CharacterState.generalRace.subRace = subRaceSelected;
}

export function backgroundEditionSelected(editionSelected)
{
    CharacterState.generalBackground.edition = editionSelected;
    CharacterState.generalBackground.source = null;
    CharacterState.generalBackground.background = null;
}

export function backgroundSourceSelected(sourceSelected)
{
    CharacterState.generalBackground.source = sourceSelected;
    CharacterState.generalBackground.background = null;
}

export function backgroundSelected(backgroundSelected)
{
    CharacterState.generalBackground.background = backgroundSelected;
}


export function featEditionSelected(editionSelected)
{
    CharacterState.generalFeats.edition = editionSelected;
    CharacterState.generalFeats.source = null;
    CharacterState.generalFeats.feats = [];
}

export function featSourceSelected(sourceSelected)
{
    CharacterState.generalFeats.source = sourceSelected;
    CharacterState.generalFeats.feats = [];
}

export function featsSelected(featList)
{
    CharacterState.generalFeats.feats = [...featList];
}

export function clearFeats()
{
    CharacterState.generalFeats.feats = [];
}
export function hasFeat(featName)
{
    return CharacterState.generalFeats.feats.includes(featName);
}