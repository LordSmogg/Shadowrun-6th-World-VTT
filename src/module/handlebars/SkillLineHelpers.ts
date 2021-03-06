import SkillField = Shadowrun.SkillField;
import { Helpers } from '../helpers';
import SR6SheetFilters = Shadowrun.SR6SheetFilters;
import SkillCategories = Shadowrun.SkillCategories;
import {SkillRules} from "../actor/SkillRules";
import {FLAGS, SYSTEM_NAME} from "../constants";

export const registerSkillLineHelpers = () => {
    Handlebars.registerHelper('SkillHeaderIcons', function (category: SkillCategories) {
        const addIcon = {
            icon: 'fas fa-plus',
            title: game.i18n.localize('SR6.AddSkill'),
            text: game.i18n.localize('SR6.Add'),
            cssClass: '',
        };
        switch (category) {
            case 'active':
                addIcon.cssClass = 'add-active';
                return [addIcon];
            case 'language':
                addIcon.cssClass = 'add-language';
                return [addIcon];
            case 'knowledge':
                addIcon.cssClass = 'add-knowledge';
                return [addIcon];
            default:
                return [];
        }
    });

    Handlebars.registerHelper('SkillHeaderRightSide', function (id, filters: SR6SheetFilters) {
        const specs = {
            text: {
                text: game.i18n.localize('SR6.Specialization'),
                cssClass: 'skill-spec-item',
            },
        };

        const rtg = {
            // Change Rating header to show active filtering.
            text: {
                text: !filters || filters.showUntrainedSkills ?
                    game.i18n.localize('SR6.Rtg') :
                    game.i18n.localize('SR6.RtgAboveZero'),
                cssClass: 'rtg',
            },
        };

        switch (id) {
            case 'active':
            case 'knowledge':
            case 'language':
                return [specs, rtg];
            default:
                return [];
        }
    });
    Handlebars.registerHelper('SkillRightSide', function (skillType: string, skill: SkillField) {
        const specs = Array.isArray(skill.specs) ? skill.specs : [skill.specs];
        return [
            {
                text: {
                    text: specs.join(', ') ?? '',
                    cssClass: 'skill-spec-item',
                },
            },
            {
                text: {
                    text: Helpers.calcTotal(skill),
                    cssClass: 'rtg',
                },
            },
        ];
    });

    Handlebars.registerHelper('SkillAdditionCssClass', function(skill: SkillField): string[] {
        const classes: string[] = [];

        // @PDF SR6#151 not defaultable skills should be shown as italic.
        if (game.settings.get(SYSTEM_NAME, FLAGS.ShowSkillsWithDetails) && !SkillRules.allowDefaultingRoll(skill)) {
            classes.push('skill-roll-not-defaultable');
        }

        return classes;
    })

    Handlebars.registerHelper('SkillIcons', function (skillType: string, skill: SkillField) {
        const editIcon = {
            icon: 'fas fa-edit',
            title: game.i18n.localize('SR6.EditSkill'),
            cssClass: '',
        };
        const removeIcon = {
            icon: 'fas fa-trash',
            title: game.i18n.localize('SR6.DeleteSkill'),
            cssClass: '',
        };
        switch (skillType) {
            case 'active':
                editIcon.cssClass = 'skill-edit';
                removeIcon.cssClass = 'remove-active'
                return [editIcon, removeIcon];
            case 'language':
                editIcon.cssClass = 'language-skill-edit';
                removeIcon.cssClass = 'remove-language';
                return [editIcon, removeIcon];
            case 'knowledge':
                editIcon.cssClass = 'knowledge-skill-edit';
                removeIcon.cssClass = 'remove-knowledge';
                return [editIcon, removeIcon];
            default:
                return [editIcon];
        }
    });

};
