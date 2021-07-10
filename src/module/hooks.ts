import { SR6 } from './config';
import { Migrator } from './migrator/Migrator';
import { registerSystemSettings } from './settings';
import { SYSTEM_NAME } from './constants';
import { SR6Actor } from './actor/SR6Actor';
import { SR6ActorSheet } from './actor/SR6ActorSheet';
import { SR6Item } from './item/SR6Item';
import { SR6ItemSheet } from './item/SR6ItemSheet';
import { ShadowrunRoller } from './rolls/ShadowrunRoller';
import { Helpers } from './helpers';
import { HandlebarManager } from './handlebars/HandlebarManager';
import { measureDistance } from './canvas';
import * as chat from './chat';
import {createItemMacro, createSkillMacro, rollItemMacro, rollSkillMacro} from './macros';

import { OverwatchScoreTracker } from './apps/gmtools/OverwatchScoreTracker';
import {_combatantGetInitiativeFormula, SR6Combat} from './combat/SR6Combat';
import { Import } from './importer/apps/import-form';
import {ChangelogApplication} from "./apps/ChangelogApplication";
import {EnvModifiersApplication} from "./apps/EnvModifiersApplication";
import {quenchRegister} from "../test/quench";

// Redeclare SR6config as a global as foundry-vtt-types CONFIG with SR6 property causes issues.
// TODO: Figure out how to change global CONFIG type
export const SR6CONFIG = SR6;

export class HooksManager {
    static registerHooks() {
        // Register your highest level hook callbacks here for a quick overview of what's hooked into.

        Hooks.once('init', HooksManager.init);

        Hooks.on('canvasInit', HooksManager.canvasInit);
        Hooks.on('ready', HooksManager.ready);
        Hooks.on('renderChatMessage', HooksManager.renderChatMessage);
        Hooks.on('getChatLogEntryContext', chat.addChatMessageContextOptions);
        Hooks.on('hotbarDrop', HooksManager.hotbarDrop);
        Hooks.on('renderSceneControls', HooksManager.renderSceneControls);
        Hooks.on('getSceneControlButtons', HooksManager.getSceneControlButtons);
        Hooks.on('getCombatTrackerEntryContext', SR6Combat.addCombatTrackerContextOptions);
        Hooks.on('renderItemDirectory', HooksManager.renderItemDirectory);
        Hooks.on('renderTokenHUD', EnvModifiersApplication.addTokenHUDFields);

        // Foundry VTT Module 'quench': https://github.com/schultzcole/FVTT-Quench
        Hooks.on('quenchReady', quenchRegister);
    }

    static init() {
        console.log(`Loading Shadowrun 5e System
___________________
 ___________ _____ 
/  ___| ___ \\  ___|
\\ \`--.| |_/ /___ \\ 
 \`--. \\    /    \\ \\
/\\__/ / |\\ \\/\\__/ /
\\____/\\_| \\_\\____/ 
===================
`);
        // Create a shadowrun6e namespace within the game global
        game['shadowrun6e'] = {
            SR6Actor,
            ShadowrunRoller,
            SR6Item,
            rollItemMacro,
            rollSkillMacro
        };

        // @ts-ignore // foundry-vtt-types is missing CONFIG.<>.documentClass
        CONFIG.Actor.documentClass = SR6Actor;
        // @ts-ignore // foundry-vtt-types is missing CONFIG.<>.documentClass
        CONFIG.Item.documentClass = SR6Item;
        // @ts-ignore // foundry-vtt-types is missing CONFIG.<>.documentClass
        CONFIG.Combat.documentClass = SR6Combat;
        // Register initiative directly (outside of system.json) as DnD5e does it.
        CONFIG.Combat.initiative.formula =  "@initiative.current.base.value[Base] + @initiative.current.dice.text[Dice] - @wounds.value[Wounds]";
        // @ts-ignore
        Combatant.prototype._getInitiativeFormula = _combatantGetInitiativeFormula;


        registerSystemSettings();

        // Register sheet application classes
        // NOTE: See dnd5e for a multi class approach for all actor types using the types array in Actors.registerSheet
        Actors.unregisterSheet('core', ActorSheet);
        Actors.registerSheet(SYSTEM_NAME, SR6ActorSheet, {
            label: "SR6.SheetActor",
            makeDefault: true
        });
        Items.unregisterSheet('core', ItemSheet);
        Items.registerSheet(SYSTEM_NAME, SR6ItemSheet, {
            label: "SR6.SheetItem",
            makeDefault: true
        });

        ['renderSR6ActorSheet', 'renderSR6ItemSheet'].forEach((s) => {
            Hooks.on(s, (app, html) => Helpers.setupCustomCheckbox(app, html));
        });

        HandlebarManager.loadTemplates();
    }

    static async ready() {
        if (game.user?.isGM) {
            await Migrator.BeginMigration();

            if (ChangelogApplication.showApplication) {
                await new ChangelogApplication().render(true);
            }

        }

        // TODO make based on foundry version
        const diceIconSelector = '#chat-controls .roll-type-select .fa-dice-d20';
        $(document).on('click', diceIconSelector, () => ShadowrunRoller.promptRoll());
        const diceIconSelectorNew = '#chat-controls .chat-control-icon .fa-dice-d20';
        $(document).on('click', diceIconSelectorNew, () => ShadowrunRoller.promptRoll());
    }

    static canvasInit() {
        if (!canvas?.ready) return;
        // @ts-ignore // TODO: TYPE: diagonaleRule doesn't exist on foundry-vtt-types anymore... does this even work anymore?
        canvas.grid.diagonalRule = game.settings.get(SYSTEM_NAME, 'diagonalMovement');
        //@ts-ignore
        // SquareGrid isn't typed.
        SquareGrid.prototype.measureDistances = measureDistance;
    }

    /**
     * Hanlde drop events on the hotbar creating different macros
     *
     * @param bar
     * @param data
     * @param slot
     * @return false NOTE: when the hook call propagation should be stopped.
     */
    static async hotbarDrop(bar, data, slot) {
        switch (data.type) {
            case 'Item':
                await createItemMacro(data.data, slot);
                return false;
            case 'Skill':
                await createSkillMacro(data.data, slot);
                return false;
            default:
                return;
        }
    }

    static renderSceneControls(controls, html) {
        html.find('[data-tool="overwatch-score-tracker"]').on('click', (event) => {
            event.preventDefault();
            new OverwatchScoreTracker().render(true);
        });
    }

    static getSceneControlButtons(controls) {
        const tokenControls = controls.find((c) => c.name === 'token');

        if (game.user?.isGM) {
            tokenControls.tools.push({
                name: 'overwatch-score-tracker',
                title: 'CONTROLS.SR6.OverwatchScoreTracker',
                icon: 'fas fa-network-wired',
                button: true
            });
        }

        tokenControls.tools.push(EnvModifiersApplication.getControl());
    }

    static renderChatMessage(message, html, data) {
        chat.addRollListeners(message, html);
    }

    static renderItemDirectory(app: Application, html: JQuery) {
        const button = $('<button>Import Chummer Data</button>');
        html.find('footer').before(button);
        button.on('click', (event) => {
            new Import().render(true);
        });
    }

}
