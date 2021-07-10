import {FormDialog, FormDialogData} from "./FormDialog";
import {SR6Actor} from "../../actor/SR6Actor";
import {PartsList} from "../../parts/PartsList";
import {Helpers} from "../../helpers";
import {SkillFlow} from "../../actor/SkillFlow";
import DefenseRollOptions = Shadowrun.DefenseRollOptions;
import ModList = Shadowrun.ModList;
import SoakRollOptions = Shadowrun.SoakRollOptions;
import SkillDialogOptions = Shadowrun.SkillDialogOptions;
import CombatData = Shadowrun.CombatData;
import DamageType = Shadowrun.DamageType;
import {SR6} from "../../config";

export class ShadowrunActorDialogs {
    static async createDefenseDialog(actor: SR6Actor, options: DefenseRollOptions, partsProps: ModList<number>): Promise<FormDialog> {
        const defenseDialogData = ShadowrunActorDialogs.getDefenseDialogData(actor, options, partsProps);

        return new FormDialog(defenseDialogData);
    }

    static async createSoakDialog(options: SoakRollOptions, soakParts: PartsList<number>): Promise<FormDialog> {
        const soakDialogData = ShadowrunActorDialogs.getSoakDialogData(options, soakParts);
        return new FormDialog(soakDialogData);
    }

    static async createSkillDialog(actor: SR6Actor, options: SkillDialogOptions, partsProps: PartsList<number>): Promise<FormDialog> {
        const skillDialogData = ShadowrunActorDialogs.getSkillDialogData(actor, options, partsProps);

        return new FormDialog(skillDialogData);
    }

    static getDefenseDialogData(actor: SR6Actor,  options: DefenseRollOptions, partsProps: ModList<number>): FormDialogData {
        const title = game.i18n.localize('SR6.Defense');

        const activeDefenses = {
            full_defense: {
                label: 'SR6.FullDefense',
                value: actor.getFullDefenseAttribute()?.value,
                initMod: -10,
            },
            dodge: {
                label: 'SR6.Dodge',
                value: actor.findActiveSkill('gymnastics')?.value,
                initMod: -5,
            },
            block: {
                label: 'SR6.Block',
                value: actor.findActiveSkill('unarmed_combat')?.value,
                initMod: -5,
            },
        };

        const equippedMeleeWeapons = actor.getEquippedWeapons().filter((w) => w.isMeleeWeapon());
        let defenseReach = 0;
        equippedMeleeWeapons.forEach((weapon) => {
            activeDefenses[`parry-${weapon.name}`] = {
                label: 'SR6.Parry',
                weapon: weapon.name,
                value: actor.findActiveSkill(weapon.getActionSkill())?.value,
                init: -5,
            };
            defenseReach = Math.max(defenseReach, weapon.getReach());
        });

        const parts = new PartsList(partsProps);
        actor._addDefenseParts(parts);

        // if we are defending a melee attack
        if (options.attack?.reach) {
            const incomingReach = options.attack.reach;
            const netReach = defenseReach - incomingReach;
            if (netReach !== 0) {
                parts.addUniquePart('SR6.Reach', netReach);
            }
        }

        const buttons = {
            continue: {
                label: game.i18n.localize('SR6.Continue'),
                callback: () => {},
            },
        };

        const onAfterClose = (html) => {
            const cover = Helpers.parseInputToNumber($(html).find('[name=cover]').val());
            const special = Helpers.parseInputToString($(html).find('[name=activeDefense]').val());
            // Zero to indicate no initiative result change.
            const combat: CombatData = {};

            if (cover) {
                parts.addUniquePart('SR6.Cover', cover)
            }
            if (special) {
                // Defense pool modifier
                const defense = activeDefenses[special];
                parts.addUniquePart(defense.label, defense.value);

                // Combat initiative modifier
                combat.initiative = defense.initMod;
            }

            return {cover, special, parts, combat};
        }

        const templatePath = 'systems/shadowrun6e/dist/templates/rolls/roll-defense.html';
        const templateData = {
            parts: parts.getMessageOutput(),
            cover: options.cover,
            activeDefenses
        };

        return {
            title,
            templateData,
            templatePath,
            buttons,
            onAfterClose
        }
    }


    static getSoakDialogData(soakRollOptions: SoakRollOptions, soakParts : PartsList<number>): FormDialogData {
        const title = game.i18n.localize('SR6.DamageResistanceTest');

        const templatePath = 'systems/shadowrun6e/dist/templates/rolls/roll-soak.html';
        const templateData = {
            damage: soakRollOptions?.damage,
            parts: soakParts.getMessageOutput(),
            elementTypes: SR6.elementTypes,
            damageTypes: SR6.damageTypes
        };

        const buttons =  {
            continue: {
                label: game.i18n.localize('SR6.Continue'),
                callback: () => {},
            },
        };

        const onAfterClose = (html: JQuery) => {
            const incomingDamage = Helpers.parseInputToNumber($(html).find('[name=incomingDamage]').val());
            const ap = Helpers.parseInputToNumber($(html).find('[name=ap]').val());
            const element = Helpers.parseInputToString($(html).find('[name=element]').val());
            const damageType = Helpers.parseInputToString($(html).find('[name=damageType]').val()) as DamageType;

            return {incomingDamage, damageType, ap, element};
        }

        return {
            title,
            templatePath,
            templateData,
            buttons,
            onAfterClose
        }
    }

    static getSkillDialogData(actor: SR6Actor, options: SkillDialogOptions, partsProps: PartsList<number>): FormDialogData {
        const title = game.i18n.localize(options.skill.label || options.skill.name);
        const templatePath = 'systems/shadowrun6e/dist/templates/rolls/skill-roll.html';

        const attributes = actor.getAttributes();
        const attribute = actor.getAttribute(options.attribute ? options.attribute : options.skill.attribute);
        const limits = actor.getLimits();

        const templateData = {
            attribute: options.skill.attribute,
            attributes: Helpers.filter(attributes, ([, value]) => value.value > 0),
            limit: attribute.limit,
            limits
        }


        const buttons = {
            roll: {
                label: game.i18n.localize('SR6.NormalSkillButton'),
                callback: () => {},
            },
        };
        // add specializations to dialog as buttons
        if (options.skill.specs?.length) {
            options.skill.specs.forEach(
                (spec) =>
                    (buttons[spec] = {
                        label: spec,
                        callback: () => {},
                    }),
            );
        }

        const onAfterClose = (html: JQuery, selectedButton) => {
            const newAtt = Helpers.parseInputToString($(html).find('[name="attribute"]').val());
            const newLimit = Helpers.parseInputToString($(html).find('[name="attribute.limit"]').val());
            const attribute = actor.getAttribute(newAtt);
            const limit = actor.getLimit(newLimit);
            // Legacy skills have a label, but no name. Custom skills have a name but no label.
            const skillLabel = game.i18n.localize(options.skill.label || options.skill.name);
            const attributeLabel = game.i18n.localize(SR6.attributes[newAtt]);
            const testLabel = game.i18n.localize('SR6.Test')

            const skillTestTitle = `${skillLabel} + ${attributeLabel} ${testLabel}`;

            partsProps.addUniquePart(attribute.label, attribute.value);

            SkillFlow.handleDefaulting(options.skill, partsProps);

            // Possible specialization based on button label.
            const isSpecialization = options.skill.specs.includes(selectedButton);
            if (isSpecialization) {
                partsProps.addUniquePart('SR6.Specialization', 2);
            }

            return {
                title: skillTestTitle,
                attribute,
                limit,
                skill: options.skill,
                parts: partsProps
            }
        }

        return {
            title,
            templatePath,
            templateData,
            buttons,
            onAfterClose
        }
    }
}