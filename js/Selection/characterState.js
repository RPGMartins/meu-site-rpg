export const CharacterState = {
    class: {
        class : null,
        edition : null,
        source : null,
        subclass : null,
    }
}

export function classSelected(classSelection){

    CharacterState.class.class = classSelection;
    CharacterState.class.edition = null;
    CharacterState.class.source = null;
    CharacterState.class.subclass = null;
}

export function classEditionSelected(classEditionSelection){
    
    CharacterState.class.edition = classEditionSelection;
    CharacterState.class.source = null;
    CharacterState.class.subclass = null;
}

export function classSourceSelected(classSourceSelection){

    CharacterState.class.source = classSourceSelection;
    CharacterState.class.subclass = null;
}

export function subClassSelected(subclassSelection){

    CharacterState.class.subclass = subclassSelection;
}
