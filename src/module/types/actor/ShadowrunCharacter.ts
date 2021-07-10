/// <reference path="../Shadowrun.ts" />

declare namespace Shadowrun {
    export type SR6ActorSheetData = ActorSheet.Data & {
        config: typeof SR6CONFIG;
        data: SR6ActorData;
        filters: SR6SheetFilters;
        isCharacter: boolean;
        isSpirit: boolean;
        isCritter: boolean;
        awakened: boolean;
        emerged: boolean;
        woundTolerance: number;
        vehicle: SR6VehicleSheetData;
    };

    export type SR6VehicleSheetData = {
        // TODO: SR6 Actor class, however conflicts between SR6Actor and SR6ActorBase prohibit this...
        driver?: object
    }

    export type SR6SheetFilters = {
        skills: string;
        showUntrainedSkills
    };

    export type SR6ActorType = SR6SpiritType | SR6CharacterType | SR6SpriteType | SR6VehicleType | SR6CritterType;

    // TODO: A lot of duplicate type definitions to what's in Actor.Data. Might cause problems during a FoundryVTT update
    export type SR6ActorBase = Actor.Data & {
        name: string;
        _id: string;
        folder: string | null;
        data: SR6ActorData;
        items: Collection<Item>;
        flags: object;
        type: string;
        permission: {
            default: string;
        };
    };


    export type SR6CharacterType = SR6ActorBase & {
        data: CharacterActorData;
        type: 'character';
    };

    export type SR6ActorData =
        SpiritActorData
        | CharacterActorData
        | SpriteActorData
        | VehicleActorData
        | CritterActorData;

    export type CharacterSkills = {
        active: Skills;
        language: KnowledgeSkillList;
        knowledge: KnowledgeSkills;
    }

    export type CharacterActorData =
        MatrixActorData &
        TwoTrackActorData &
        ArmorActorData &
        MagicActorData &
        WoundsActorData &
        MovementActorData &
        NPCActorData & {
        attributes: Attributes;
        limits: Limits;
        skills: CharacterSkills;
        modifiers: Modifiers;
        special: SpecialTrait;
        initiative: Initiative;
        recoil_compensation: number;
        metatype: string | keyof typeof SR6CONFIG.character.types;
        full_defense_attribute: string;
    };

    export type PhysicalTrackActorData = {
        track: {
            physical: PhysicalTrack;
        };
    };
    export type StunTrackActorData = {
        track: {
            stun: StunTrack;
        };
    };

    export type MovementActorData = {
        movement: Movement;
    };

    export type ArmorActorData = {
        armor: ActorArmor;
    };

    export type WoundsActorData = {
        wounds: WoundType;
    };

    export type TwoTrackActorData = {
        track: Tracks;
    };

    export type MagicActorData = {
        magic: Magic;
    };

    export type MatrixActorData = {
        matrix: ActorMatrix;
    };

    export type NPCActorData = {
        is_npc: boolean;
        npc: NPC
    }

    export type WoundType = {
        value: number;
    };

    export type Modifiers = {
        [name: string]: NumberOrEmpty;
    };

    export type InitiativeType = {
        base: BaseValuePair<number> & ModifiableValue;
        dice: BaseValuePair<number> &
            ModifiableValue & {
            text: string;
        };
    };

    export type Initiative = {
        perception: string;
        meatspace: InitiativeType;
        matrix: InitiativeType;
        astral: InitiativeType;
        current: InitiativeType;
        edge?: boolean;
    };

    export type SkillEditFormData = BaseEntitySheet.Data & {
        data?: SkillField
        editable_name?: boolean
        editable_canDefault: boolean
        editable_attribute: boolean
        attributes: object
    };
}
