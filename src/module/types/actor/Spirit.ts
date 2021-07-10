/// <reference path="../Shadowrun.ts" />

declare namespace Shadowrun {
    export type SpiritType = keyof typeof SR6CONFIG.spiritTypes;

    export type SR6SpiritType = SR6ActorBase & {
        data: SpiritActorData;
        type: 'spirit';
    };
    export type SpiritActorData = MagicActorData &
        TwoTrackActorData &
        ArmorActorData &
        WoundsActorData &
        MovementActorData & {
        spiritType: SpiritType;
        force: number;
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
