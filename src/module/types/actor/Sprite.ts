/// <reference path="../Shadowrun.ts" />

declare namespace Shadowrun {
    export type SpriteType = keyof typeof SR6CONFIG.spriteTypes;

    export type SR6SpriteType = SR6ActorBase & {
        data: SpriteActorData;
        type: 'sprite';
    };
    export type SpriteActorData = MatrixActorData & {
        level: number;
        services: number;
        registered: boolean;
        spriteType: SpriteType;
        attributes: Attributes;
        limits: Limits;
        skills: {
            active: Skills;
            language: KnowledgeSkillList;
            knowledge: KnowledgeSkills;
        };
        special: SpecialTrait;
        initiative: Initiative;
        modifiers: Modifiers;
    };

}
