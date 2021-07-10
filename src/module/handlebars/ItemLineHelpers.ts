import SR6ItemType = Shadowrun.SR6ItemType;
import { SR6ItemDataWrapper } from '../item/SR6ItemDataWrapper';
import {SR6} from "../config";

export const registerItemLineHelpers = () => {
    Handlebars.registerHelper('ItemHeaderIcons', function (id) {
        const PlusIcon = 'fas fa-plus';
        const AddText = game.i18n.localize('SR6.Add');
        const addIcon = {
            icon: PlusIcon,
            text: AddText,
            title: game.i18n.localize('SR6.CreateItem'),
            cssClass: 'item-create',
        };
        switch (id) {
            case 'lifestyle':
                addIcon.title = game.i18n.localize('SR6.CreateItemLifestyle');
                return [addIcon];
            case 'contact':
                addIcon.title = game.i18n.localize('SR6.CreateItemContact');
                return [addIcon];
            case 'sin':
                addIcon.title = game.i18n.localize('SR6.CreateItemSIN');
                return [addIcon];
            case 'license':
                addIcon.title = game.i18n.localize('SR6.CreateItemLicense');
                return [addIcon];
            case 'quality':
                addIcon.title = game.i18n.localize('SR6.CreateItemQuality');
                return [addIcon];
            case 'adept_power':
                addIcon.title = game.i18n.localize('SR6.CreateItemAdeptPower');
                return [addIcon];
            case 'action':
                addIcon.title = game.i18n.localize('SR6.CreateItemAction');
                return [addIcon];
            case 'spell':
                addIcon.title = game.i18n.localize('SR6.CreateItemSpell');
                return [addIcon];
            case 'gear':
                addIcon.title = game.i18n.localize('SR6.CreateItemGear');
                return [addIcon];
            case 'complex_form':
                addIcon.title = game.i18n.localize('SR6.CreateItemComplexForm');
                return [addIcon];
            case 'program':
                addIcon.title = game.i18n.localize('SR6.CreateItemProgram');
                return [addIcon];
            case 'weapon':
                addIcon.title = game.i18n.localize('SR6.CreateItemWeapon');
                return [addIcon];
            case 'armor':
                addIcon.title = game.i18n.localize('SR6.CreateItemArmor');
                return [addIcon];
            case 'ammo':
                addIcon.title = game.i18n.localize('SR6.CreateItemAmmo');
                return [addIcon];
            case 'device':
                addIcon.title = game.i18n.localize('SR6.CreateItemDevice');
                return [addIcon];
            case 'equipment':
                addIcon.title = game.i18n.localize('SR6.CreateItemEquipment');
                return [addIcon];
            case 'cyberware':
                addIcon.title = game.i18n.localize('SR6.CreateItemCyberware');
                return [addIcon];
            case 'bioware':
                addIcon.title = game.i18n.localize('SR6.CreateItemBioware');
                return [addIcon];
            case 'critter_power':
                addIcon.title = game.i18n.localize('SR6.CreateItemCritterPower');
                return [addIcon];
            case 'sprite_power':
                addIcon.title = game.i18n.localize('SR6.CreateItemSpritePower');
                return [addIcon];
            default:
                return [];
        }
    });

    Handlebars.registerHelper('ItemHeaderRightSide', function (id) {
        switch (id) {
            case 'action':
                return [
                    {
                        text: {
                            text: game.i18n.localize('SR6.Skill'),
                            cssClass: 'six',
                        },
                    },
                    {
                        text: {
                            text: game.i18n.localize('SR6.Attribute'),
                            cssClass: 'six',
                        },
                    },
                    {
                        text: {
                            text: game.i18n.localize('SR6.Attribute'),
                            cssClass: 'six',
                        },
                    },
                    {
                        text: {
                            text: game.i18n.localize('SR6.Limit'),
                            cssClass: 'six',
                        },
                    },
                    {
                        text: {
                            text: game.i18n.localize('SR6.Modifier'),
                            cssClass: 'six',
                        },
                    },
                ];
            case 'weapon':
            case 'armor':
            case 'device':
            case 'equipment':
            case 'cyberware':
            case 'bioware':
            case 'ammo':
                return [
                    {
                        text: {
                            text: game.i18n.localize('SR6.Qty'),
                        },
                    },
                ];
            case 'complex_form':
                return [
                    {
                        text: {
                            text: game.i18n.localize('SR6.Target'),
                        },
                    },
                    {
                        text: {
                            text: game.i18n.localize('SR6.Duration'),
                        },
                    },
                    {
                        text: {
                            text: game.i18n.localize('SR6.Fade'),
                        },
                    },
                ];
            case 'adept_power':
                return [
                    {
                        text: {
                            text: game.i18n.localize('SR6.PowerType'),
                        },
                    },
                ];
            case 'spell':
                return [
                    {
                        text: {
                            text: game.i18n.localize('SR6.SpellType'),
                        },
                    },
                    {
                        text: {
                            text: game.i18n.localize('SR6.SpellRange'),
                        },
                    },
                    {
                        text: {
                            text: game.i18n.localize('SR6.Duration'),
                        },
                    },
                    {
                        text: {
                            text: game.i18n.localize('SR6.Drain'),
                        },
                    },
                ];
            case 'critter_power':
                return [
                    {
                        text: {
                            text: game.i18n.localize('SR6.CritterPower.Type'),
                        },
                    },
                    {
                        text: {
                            text: game.i18n.localize('SR6.CritterPower.Range'),
                        },
                    },
                    {
                        text: {
                            text: game.i18n.localize('SR6.CritterPower.Duration'),
                        },
                    },
                ];
            case 'quality':
                return [
                    {
                        text: {
                            text: game.i18n.localize('SR6.QualityType'),
                        },
                    },
                ];
            default:
                return [];
        }
    });

    Handlebars.registerHelper('ItemRightSide', function (item: SR6ItemType) {
        const wrapper = new SR6ItemDataWrapper(item);
        const qtyInput = {
            input: {
                type: 'number',
                value: wrapper.getQuantity(),
                cssClass: 'item-qty',
            },
        };
        switch (item.type) {
            case 'action':
                return [
                    {
                        text: {
                            text: game.i18n.localize(SR6.activeSkills[wrapper.getActionSkill() ?? '']),
                            cssClass: 'six',
                        },
                    },
                    {
                        text: {
                            text: game.i18n.localize(SR6.attributes[wrapper.getActionAttribute() ?? '']),
                            cssClass: 'six',
                        },
                    },
                    {
                        text: {
                            text: game.i18n.localize(SR6.attributes[wrapper.getActionAttribute2() ?? '']),
                            cssClass: 'six',
                        },
                    },
                    {
                        text: {
                            text: wrapper.getLimitAttribute()
                                ? game.i18n.localize(SR6.attributes[wrapper.getLimitAttribute() ?? ''])
                                : wrapper.getActionLimit(),
                            cssClass: 'six',
                        },
                    },
                    {
                        text: {
                            text: wrapper.getActionDicePoolMod(),
                            cssClass: 'six',
                        },
                    },
                ];
            case 'armor':
            case 'ammo':
            case 'device':
            case 'equipment':
            case 'cyberware':
            case 'bioware':
                return [qtyInput];
            case 'weapon':
                if (wrapper.isRangedWeapon()) {
                    const count = wrapper.getAmmo()?.current.value ?? 0;
                    const max = wrapper.getAmmo()?.current.max ?? 0;
                    const text = count < max ? `${game.i18n.localize('SR6.WeaponReload')} (${count}/${max})` : game.i18n.localize('SR6.AmmoFull');
                    const cssClass = 'no-break' + (count < max ? ' reload-ammo roll' : 'faded');
                    return [
                        {
                            text: {
                                title: `${game.i18n.localize('SR6.WeaponAmmoCount')}: ${count}`,
                                text,
                                cssClass,
                            },
                        },
                        {
                            text: {
                                text: '',
                            },
                        },
                        qtyInput,
                    ];
                } else {
                    return [qtyInput];
                }

            case 'quality':
                return [
                    {
                        text: {
                            text: game.i18n.localize(SR6.qualityTypes[item.data.type ?? '']),
                        },
                    },
                ];

            case 'adept_power':
                return [
                    {
                        text: {
                            text: game.i18n.localize(SR6.adeptPower.types[item.data.type ?? '']),
                        },
                    },
                ];
            case 'spell':
                return [
                    {
                        text: {
                            text: game.i18n.localize(SR6.spellTypes[item.data.type ?? '']),
                        },
                    },
                    {
                        text: {
                            text: game.i18n.localize(SR6.spellRanges[item.data.range ?? '']),
                        },
                    },
                    {
                        text: {
                            text: game.i18n.localize(SR6.durations[item.data.duration ?? '']),
                        },
                    },
                    {
                        text: {
                            text: wrapper.getDrain(),
                        },
                    },
                ];
            case 'critter_power':
                return [
                    {
                        text: {
                            text: game.i18n.localize(SR6.critterPower.types[item.data.powerType ?? '']),
                        },
                    },
                    {
                        text: {
                            text: game.i18n.localize(SR6.critterPower.ranges[item.data.range ?? '']),
                        },
                    },
                    {
                        text: {
                            text: game.i18n.localize(SR6.critterPower.durations[item.data.duration ?? '']),
                        },
                    },
                ];

            case 'complex_form':
                return [
                    {
                        text: {
                            text: game.i18n.localize(SR6.matrixTargets[item.data.target ?? '']),
                        },
                    },
                    {
                        text: {
                            text: game.i18n.localize(SR6.durations[item.data.duration ?? '']),
                        },
                    },
                    {
                        text: {
                            text: String(item.data.fade),
                        },
                    },
                ];
            case 'program':
                return [
                    {
                        button: {
                            cssClass: `item-equip-toggle ${wrapper.isEquipped() ? 'light' : ''}`,
                            short: true,
                            text: wrapper.isEquipped() ? game.i18n.localize('SR6.Loaded') : game.i18n.localize('SR6.Load') + ' >>',
                        },
                    },
                ];
            default:
                return [];
        }
    });

    Handlebars.registerHelper('ItemIcons', function (item: SR6ItemType) {
        const wrapper = new SR6ItemDataWrapper(item);
        const editIcon = {
            icon: 'fas fa-edit item-edit',
            title: game.i18n.localize('SR6.EditItem'),
        };
        const removeIcon = {
            icon: 'fas fa-trash item-delete',
            title: game.i18n.localize('SR6.DeleteItem'),
        };
        const equipIcon = {
            icon: `${wrapper.isEquipped() ? 'fas fa-check-circle' : 'far fa-circle'} item-equip-toggle`,
            title: game.i18n.localize('SR6.ToggleEquip'),
        };
        const pdfIcon = {
            icon: 'fas fa-file open-source-pdf',
            title: game.i18n.localize('SR6.OpenSourcePdf'),
        };

        const icons = [editIcon, removeIcon];

        if (ui['PDFoundry']) {
            icons.unshift(pdfIcon);
        }

        switch (wrapper.getType()) {
            case 'program':
            case 'armor':
            case 'device':
            case 'equipment':
            case 'cyberware':
            case 'bioware':
            case 'weapon':
                icons.unshift(equipIcon);
        }

        return icons;
    });
};
