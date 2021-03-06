/// <reference path="../Shadowrun.ts" />

declare namespace Shadowrun {
    export type CritterType = keyof typeof SR6CONFIG.critterTypes;

    export type SR6CritterType = SR6ActorBase & {
        data: CritterActorData;
        type: 'critter';
    };
    export type CritterActorData = MagicActorData &
        TwoTrackActorData &
        ArmorActorData &
        WoundsActorData &
        MatrixActorData &
        MovementActorData & {
        attributes: Attributes;
        limits: Limits;
        skills: {
            active: Skills;
            language: KnowledgeSkillList;
            knowledge: KnowledgeSkills;
        };
        modifiers: Modifiers;
        special: SpecialTrait;
        initiative: Initiative;
    };
}
