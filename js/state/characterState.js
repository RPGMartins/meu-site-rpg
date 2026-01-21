export const CharacterState = {
    generalClass: {
        class : null,
        edition : null,
        source : null,
        subclass : null,
    }
}

export function classSelected(classSelection){

    CharacterState.generalClass.class = classSelection;
    CharacterState.generalClass.edition = null;
    CharacterState.generalClass.source = null;
    CharacterState.generalClass.subclass = null;
}

export function classEditionSelected(classEditionSelection){
    
    CharacterState.generalClass.edition = classEditionSelection;
    CharacterState.generalClass.source = null;
    CharacterState.generalClass.subclass = null;
}

export function classSourceSelected(classSourceSelection){

    CharacterState.generalClass.source = classSourceSelection;
    CharacterState.generalClass.subclass = null;
}

export function subClassSelected(subclassSelection){

    CharacterState.generalClass.subclass = subclassSelection;
}
