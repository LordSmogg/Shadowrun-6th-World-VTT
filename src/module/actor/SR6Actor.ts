import {ShadowrunRoll, ShadowrunRoller} from '../rolls/ShadowrunRoller';
import {Helpers} from '../helpers';
import {SR6Item} from '../item/SR6Item';
import {FLAGS, SKILL_DEFAULT_NAME, SR, SYSTEM_NAME} from '../constants';
import {PartsList} from '../parts/PartsList';
import {ActorPrepFactory} from './prep/ActorPrepFactory';
import {ShadowrunActorDialogs} from "../apps/dialogs/ShadowrunActorDialogs";
import {createRollChatMessage} from "../chat";
import {SR6Combat} from "../combat/SR6Combat";
import {Modifiers} from "../sr6/Modifiers";
import {SoakFlow} from './SoakFlow';
import {DefaultValues} from '../dataTemplates';
import {SkillFlow} from "./SkillFlow";
import ActorRollOptions = Shadowrun.ActorRollOptions;
import DefenseRollOptions = Shadowrun.DefenseRollOptions;
import SoakRollOptions = Shadowrun.SoakRollOptions;
import AttributeField = Shadowrun.AttributeField;
import SkillRollOptions = Shadowrun.SkillRollOptions;
import SkillField = Shadowrun.SkillField;
import ModList = Shadowrun.ModList;
import LimitField = Shadowrun.LimitField;
import SR6ActorType = Shadowrun.SR6ActorType;
import EdgeAttributeField = Shadowrun.EdgeAttributeField;
import VehicleActorData = Shadowrun.VehicleActorData;
import VehicleStat = Shadowrun.VehicleStat;
import Attributes = Shadowrun.Attributes;
import Limits = Shadowrun.Limits;
import DamageData = Shadowrun.DamageData;
import TrackType = Shadowrun.TrackType;
import OverflowTrackType = Shadowrun.OverflowTrackType;
import SpellDefenseOptions = Shadowrun.SpellDefenseOptions;
import NumberOrEmpty = Shadowrun.NumberOrEmpty;
import CharacterActorData = Shadowrun.CharacterActorData;
import SR6VehicleType = Shadowrun.SR6VehicleType;
import VehicleStats = Shadowrun.VehicleStats;
import SR6CharacterType = Shadowrun.SR6CharacterType;
import ActorArmorData = Shadowrun.ActorArmorData;
import ConditionData = Shadowrun.ConditionData;
import SR6SpiritType = Shadowrun.SR6SpiritType;
import SR6SpriteType = Shadowrun.SR6SpriteType;
import SR6CritterType = Shadowrun.SR6CritterType;
import Skills = Shadowrun.Skills;
import {SkillRules} from "./SkillRules";
import CharacterSkills = Shadowrun.CharacterSkills;
import {SR6} from "../config";

export class SR6Actor extends Actor<SR6ActorType> {
    // NOTE: Overwrite Actor.data additionally to extends Actor<T as SR6Actortype.Data: SR6ActorData> to still have
    //       access to Actor.data.type checks.

    getOverwatchScore() {
        const os = this.getFlag(SYSTEM_NAME, 'overwatchScore');
        return os !== undefined ? os : 0;
    }

    async setOverwatchScore(value) {
        const num = parseInt(value);
        if (!isNaN(num)) {
            return this.setFlag(SYSTEM_NAME, 'overwatchScore', num);
        }
    }

    /**
     * General data preparation order.
     * Check base, embeddedEntities and derived methods (see super.prepareData implementation for order)
     * Only implement data preparation here that doesn't fall into the other three categories.
     */
    prepareData() {
        super.prepareData();
    }

    /**
     *  Prepare base data. Be careful that this ONLY included data not in need for item access. Check ClientDocumentMixin.prepareData for order of data prep.
     */
    prepareBaseData() {
        super.prepareBaseData();
    }

    /**
     * prepare embedded entities. Check ClientDocumentMixin.prepareData for order of data prep.
     */
    prepareEmbeddedEntities() {
        super.prepareEmbeddedEntities();
    }

    /**
     * prepare embedded entities. Check ClientDocumentMixin.prepareData for order of data prep.
     */
    prepareDerivedData() {
        super.prepareDerivedData();

        // General actor data preparation has been moved to derived data, as it depends on prepared item data.
        const actorData = this.data;
        const prepper = ActorPrepFactory.Create(actorData);
        if (prepper) {
            prepper.prepare();
        }
    }

    getModifier(modifierName: string): NumberOrEmpty {
        return this.data.data.modifiers[modifierName];
    }

    findActiveSkill(skillName?: string): SkillField | undefined {
        // Check for faulty to catch empty names as well as missing parameters.
        if (!skillName) return undefined;

        // Handle legacy skills (name is id)
        const skills = this.getActiveSkills();
        const skill = skills[skillName];
        if (skill) return skill;

        // Handle custom skills (name is not id)
        return Object.values(skills).find(skill => skill.name === skillName);
    }

    findAttribute(attributeName?: string): AttributeField | undefined {
        if (attributeName === undefined) return undefined;
        return this.data.data.attributes[attributeName];
    }

    findVehicleStat(statName?: string): VehicleStat | undefined {
        if (statName === undefined) return;

        const vehicleStats = this.getVehicleStats();
        if (vehicleStats)
            return vehicleStats[statName];
    }

    findLimitFromAttribute(attributeName?: string): LimitField | undefined {
        if (attributeName === undefined) return undefined;
        const attribute = this.findAttribute(attributeName);
        if (!attribute?.limit) return undefined;
        return this.findLimit(attribute.limit);
    }

    findLimit(limitName?: string): LimitField | undefined {
        if (!limitName) return undefined;
        return this.data.data.limits[limitName];
    }

    getWoundModifier(): number {
        if (!("wounds" in this.data.data)) return 0;
        return -1 * this.data.data.wounds.value || 0;
    }

    /** Use edge on actors that have an edge attribute.
     *
     * NOTE: This doesn't only include characters but spirits, critters and more.
     */
    async useEdge(by: number = -1) {
        const edge = this.getEdge();
        if (edge && edge.value === 0) return;
        // NOTE: There used to be a bug which could lower edge usage below zero. Let's quietly ignore and reset. :)
        const usesLeft = edge.uses > 0 ? edge.uses : 0;
        const uses = Math.min(edge.value, usesLeft + by);

        await this.update({'data.attributes.edge.uses': uses});
    }

    getEdge(): EdgeAttributeField {
        return this.data.data.attributes.edge;
    }

    hasArmor(): boolean {
        return "armor" in this.data.data;
    }

    getArmor(): ActorArmorData {
        if ("armor" in this.data.data)
            return this.data.data.armor;

        return DefaultValues.actorArmorData();
    }

    // TODO: Foundry 0.9 Check if this can be replaced with this.items.get and correct typing.
    getOwnedSR6Item(itemId: string): SR6Item | null {
        return this.items.get(itemId) as unknown as  SR6Item;
    }

    getMatrixDevice(): SR6Item | undefined | null {
        if (!("matrix" in this.data.data)) return;
        const matrix = this.data.data.matrix;
        if (matrix.device) return this.getOwnedSR6Item(matrix.device);
    }

    getFullDefenseAttribute(): AttributeField | undefined {
        if (this.isVehicle()) {
            return this.findVehicleStat('pilot');
        } else if (this.isCharacter()) {
            const character = this.asCharacterData();
            if (character) {
                let att = character.data.full_defense_attribute;
                if (!att) att = 'willpower';
                return this.findAttribute(att);
            }
        }
    }

    getEquippedWeapons(): SR6Item[] {
        // @ts-ignore // TODO: How to define SR6Actor.items as SR6Item[]?
        return this.items.filter((item: SR6Item) => item.isEquipped() && item.isWeapon());
    }

    getRecoilCompensation(): number {
        let total = 1; // always get 1
        const strength = this.findAttribute('strength');
        if (strength) {
            total += Math.ceil(strength.value / 3);
        }
        return total;
    }

    getDeviceRating(): number {
        if (!("matrix" in this.data.data)) return 0;
        // @ts-ignore // parseInt does indeed allow number types.
        return parseInt(this.data.data.matrix.rating);
    }

    getAttributes(): Attributes {
        return this.data.data.attributes;
    }

    getAttribute(name: string): AttributeField {
        const attributes = this.getAttributes();
        return attributes[name];
    }

    getLimits(): Limits {
        return this.data.data.limits;
    }

    getLimit(name: string): LimitField {
        const limits = this.getLimits();
        return limits[name];
    }

    /** Return actor type, which can be different kind of actors from 'character' to 'vehicle'.
     *  Please check SR6ActorType for reference.
     */
    getType(): string {
        return this.data.type;
    }

    isCharacter(): boolean {
        return this.getType() === 'character';
    }

    isSpirit(): boolean {
        return this.getType() === 'spirit';
    }

    isSprite(): boolean {
        return this.getType() === 'sprite';
    }

    isVehicle() {
        return this.getType() === 'vehicle';
    }

    isGrunt() {
        if (!("is_npc" in this.data.data) || !("npc" in this.data.data)) return false;

        return this.data.data.is_npc && this.data.data.npc.is_grunt;
    }

    isCritter() {
        return this.getType() === 'critter';
    }

    getVehicleTypeSkillName(): string | undefined {
        if (!("vehicleType" in this.data.data)) return;

        switch (this.data.data.vehicleType) {
            case 'air':
                return 'pilot_aircraft';
            case 'ground':
                return 'pilot_ground_craft';
            case 'water':
                return 'pilot_water_craft';
            case 'aerospace':
                return 'pilot_aerospace';
            case 'walker':
                return 'pilot_walker';
            case 'exotic':
                return'pilot_exotic_vehicle';
            default:
                return;
        }
    }

    getVehicleTypeSkill(): SkillField | undefined {
        if (this.isVehicle()) return;

        const name = this.getVehicleTypeSkillName();
        return this.findActiveSkill(name);
    }

    getSkills(): CharacterSkills {
        return this.data.data.skills;
    }

    getActiveSkills(): Skills {
        return this.data.data.skills.active;
    }

    /**
     * Return the full pool of a skill including attribute and possible specialization bonus.
     * @param skillId The ID of the skill. Note that this can differ from what is shown in the skill list. If you're
     *                unsure about the id and want to search
     * @param options An object to change the behaviour.
     *                The property specialization will trigger the pool value to be raised by a specialization modifier
     *                The property byLbale will cause the param skillId to be interpreted as the shown i18n label.
     */
    getPool(skillId: string, options= {specialization: false, byLabel: false}): number {
        const skill = options.byLabel ? this.getSkillByLabel(skillId) : this.getSkill(skillId);
        if (!skill || !skill.attribute) return 0;
        if (!SkillFlow.allowRoll(skill)) return 0;

        const attribute = this.getAttribute(skill.attribute);

        // An attribute can have a NaN value if no value has been set yet. Do the skill for consistency.
        const attributeValue = typeof attribute.value === 'number' ? attribute.value : 0;
        const skillValue = typeof skill.value === 'number' ? skill.value : 0;

        if (SkillRules.mustDefaultToRoll(skill) && SkillRules.allowDefaultingRoll(skill)) {
            return SkillRules.getDefaultingModifier() + attributeValue;
        }

        const specializationBonus = options.specialization ? SR.skill.SPECIALIZATION_MODIFIER : 0;
        return skillValue + attributeValue + specializationBonus;
    }

    /**
     * Find a skill either by id or label.
     *
     * Skills are mapped by an id, which can be a either a lower case name (legacy skills) or a short uid (custom, language, knowledge).
     * Legacy skills use their name as the id, while not having a name set on the SkillField.
     * Custom skills use an id and have their name set, however no label. This goes for active, language and knowledge.
     *
     * NOTE: Normalizing skill mapping from active, language and knowledge to a single skills with a type property would
     *       clear this function up.
     *
     * @param id Either the searched id, name or translated label of a skill
     * @param options .byLabel when true search will try to match given skillId with the translated label
     */
    getSkill(id: string, options= {byLabel: false}): SkillField | undefined {
        if (options.byLabel)
            return this.getSkillByLabel(id);

        const { skills } = this.data.data;

        // Find skill by direct id to key matching.
        if (skills.active.hasOwnProperty(id)) {
            return skills.active[id];
        }
        if (skills.language.value.hasOwnProperty(id)) {
            return skills.language.value[id];
        }
        // Knowledge skills are de-normalized into categories (street, hobby, ...)
        for (const categoryKey in skills.knowledge) {
            if (skills.knowledge.hasOwnProperty(categoryKey)) {
                const category = skills.knowledge[categoryKey];
                if (category.value.hasOwnProperty(id)) {
                    return category.value[id];
                }
            }
        }
    }

    /**
     * Search all skills for a matching i18n translation label.
     * NOTE: You should use getSkill if you have the skillId ready. Only use this for ease of use!
     *
     * @param searchedFor The translated output of either the skill label (after localize) or name of the skill in question.
     * @return The first skill found with a matching translation or name.
     */
    getSkillByLabel(searchedFor: string): SkillField|undefined {
        if (!searchedFor) return;

        const possibleMatch = (skill: SkillField): string =>  skill.label ? game.i18n.localize(skill.label) : skill.name;

        const skills = this.getSkills();

        for (const skill of Object.values(skills.active)) {
            if (searchedFor === possibleMatch(skill))
                return skill;
        }

        for (const skill of Object.values(skills.language.value)) {
            if (searchedFor === possibleMatch(skill))
                return skill;
        }

        // Iterate over all different knowledge skill categories
        for (const categoryKey in skills.knowledge) {
            if (!skills.knowledge.hasOwnProperty(categoryKey)) continue;
            // Typescript can't follow the flow here...
            const categorySkills = skills.knowledge[categoryKey].value as SkillField[];
            for (const skill of Object.values(categorySkills) ) {
                if (searchedFor === possibleMatch(skill))
                    return skill;
            }
        }
    }

    getSkillLabel(skillId: string): string {
        const skill = this.getSkill(skillId);
        if (!skill) {
            return '';
        }

        return skill.label ? skill.label : skill.name ? skill.name : '';
    }

    async addKnowledgeSkill(category, skill?): Promise<string> {
        const defaultSkill = {
            name: '',
            specs: [],
            base: 0,
            value: 0,
            mod: 0,
        };
        skill = {
            ...defaultSkill,
            ...skill,
        };

        const id = randomID(16);
        const value = {};
        value[id] = skill;
        const fieldName = `data.skills.knowledge.${category}.value`;
        const updateData = {};
        updateData[fieldName] = value;

        await this.update(updateData);

        return id;
    }

    async addActiveSkill(skillData: Partial<SkillField> = {name: SKILL_DEFAULT_NAME}): Promise<string | undefined> {
        const skill = DefaultValues.skillData(skillData);

        const activeSkillsPath = 'data.skills.active';
        const updateSkillDataResult = Helpers.getRandomIdSkillFieldDataEntry(activeSkillsPath, skill);

        if (!updateSkillDataResult) return;

        const {updateSkillData, id} = updateSkillDataResult;

        await this.update(updateSkillData as object);

        return id;
    }

    async removeLanguageSkill(skillId) {
        const updateData = Helpers.getDeleteDataEntry('data.skills.language.value', skillId);
        await this.update(updateData);
    }

    async addLanguageSkill(skill): Promise<string> {
        const defaultSkill = {
            name: '',
            specs: [],
            base: 0,
            value: 0,
            // TODO: BUG ModifiableValue is ModList<number>[] and not number
            mod: 0,
        };
        skill = {
            ...defaultSkill,
            ...skill,
        };

        const id = randomID(16);
        const value = {};
        value[id] = skill;
        const fieldName = `data.skills.language.value`;
        const updateData = {};
        updateData[fieldName] = value;

        await this.update(updateData);

        return id;
    }

    async removeKnowledgeSkill(skillId, category) {
        const updateData = Helpers.getDeleteDataEntry(`data.skills.knowledge.${category}.value`, skillId);
        await this.update(updateData);
    }

    /** Delete the given active skill by it's id. It doesn't
     *
     * @param skillId Either a random id for custom skills or the skills name used as an id.
     */
    async removeActiveSkill(skillId: string) {
        const activeSkills = this.getActiveSkills();
        if (!activeSkills.hasOwnProperty(skillId)) return;
        const skill = this.getSkill(skillId);
        if (!skill) return;

        // Don't delete legacy skills to allow prepared items to use them, should the user delete by accident.
        // New custom skills won't have a label set also.
        if (skill.name === '' && skill.label !== undefined && skill.label !== '') {
            await this.hideSkill(skillId);
            // NOTE: For some reason unlinked token actors won't cause a render on update?
            if (!this.data.token.actorLink)
                await this.sheet.render();
            return;
        }

        // Remove custom skills without mercy!
        const updateData = Helpers.getDeleteDataEntry('data.skills.active', skillId);
        await this.update(updateData);
    }

    /**
     * Mark the given skill as hidden.
     *
     * NOTE: Hiding skills has
     *
     * @param skillId The id of any type of skill.
     */
    async hideSkill(skillId: string) {
        if (!skillId) return;
        const skill = this.getSkill(skillId);
        if (!skill) return;

        skill.hidden = true;
        const updateData = Helpers.getUpdateDataEntry(`data.skills.active.${skillId}`, skill);
        await this.update(updateData);
    }

    /**
     * mark the given skill as visible.
     *
     * @param skillId The id of any type of skill.
     */
    async showSkill(skillId: string) {
        if (!skillId) return;
        const skill = this.getSkill(skillId);
        if (!skill) return;

        skill.hidden = false;
        const updateData = Helpers.getUpdateDataEntry(`data.skills.active.${skillId}`, skill);
        await this.update(updateData);
    }

    /**
     * Show all hidden skills.
     */
    async showHiddenSkills() {
        const updateData = {};

        const skills = this.getActiveSkills();
        for (const [id, skill] of Object.entries(skills)) {
            if (skill.hidden === true) {
                skill.hidden = false;
                updateData[`data.skills.active.${id}`] = skill;
            }
        }

        if (!updateData) return;

        await this.update(updateData);
        // NOTE: For some reason unlinked token actors won't cause a render on update?
        if (!this.data.token.actorLink)
                await this.sheet.render();
    }

    async rollFade(options: ActorRollOptions = {}, incoming = -1): Promise<ShadowrunRoll|undefined> {
        const wil = duplicate(this.data.data.attributes.willpower);
        const res = duplicate(this.data.data.attributes.resonance);
        const data = this.data.data;

        const parts = new PartsList<number>();
        parts.addUniquePart(wil.label, wil.value);
        parts.addUniquePart(res.label, res.value);
        if (data.modifiers.fade) parts.addUniquePart('SR6.Bonus', data.modifiers.fade);

        let title = `${game.i18n.localize('SR6.Resist')} ${game.i18n.localize('SR6.Fade')}`;

        const actor = this;
        const roll = await ShadowrunRoller.advancedRoll({
            parts: parts.list,
            actor,
            title: title,
            wounds: false,
            hideRollMessage: true
        });

        if (!roll) return;

        // Reduce damage by soak roll and inform user.
        const incomingDamage = Helpers.createDamageData(incoming, 'stun');
        const damage = Helpers.reduceDamageByHits(incomingDamage, roll.hits, 'SR6.Fade');

        await createRollChatMessage({title, roll, actor, damage});

        return roll;
    }

    async rollDrain(options: ActorRollOptions = {}, incoming = -1): Promise<ShadowrunRoll|undefined> {
        if (!this.isCharacter()) return;

        const data = this.data.data as CharacterActorData;

        const wil = duplicate(data.attributes.willpower);
        const drainAtt = duplicate(data.attributes[data.magic.attribute]);

        const parts = new PartsList<number>();
        parts.addPart(wil.label, wil.value);
        parts.addPart(drainAtt.label, drainAtt.value);
        if (data.modifiers.drain) parts.addUniquePart('SR6.Bonus', data.modifiers.drain);

        let title = `${game.i18n.localize('SR6.Resist')} ${game.i18n.localize('SR6.Drain')}`;
        const actor = this;
        const roll = await ShadowrunRoller.advancedRoll({
            parts: parts.list,
            title,
            actor,
            wounds: false,
            hideRollMessage: true
        });

        if (!roll) return;

        // Reduce damage by soak roll and inform user.
        const incomingDamage = Helpers.createDamageData(incoming, 'stun');
        const damage = Helpers.reduceDamageByHits(incomingDamage, roll.hits, 'SR6.Drain');

        await createRollChatMessage({title, roll, actor, damage});

        return roll;
    }

    rollArmor(options: ActorRollOptions = {}, partsProps: ModList<number> = []) {
        const parts = new PartsList(partsProps);
        this._addArmorParts(parts);
        return ShadowrunRoller.advancedRoll({
            event: options.event,
            actor: this,
            parts: parts.list,
            title: game.i18n.localize('SR6.Armor'),
            wounds: false,
        });
    }

    /** A attack defense is anything against visible attacks (ranged weapons, melee weapons, indirect spell attacks, ...)
     */
    async rollAttackDefense(options: DefenseRollOptions = {}, partsProps: ModList<number> = []): Promise<ShadowrunRoll | undefined> {
        const {attack} = options;

        const defenseDialog = await ShadowrunActorDialogs.createDefenseDialog(this, options, partsProps);
        const defenseActionData = await defenseDialog.select();

        if (defenseDialog.canceled) return;

        const roll = await ShadowrunRoller.advancedRoll({
            event: options.event,
            actor: this,
            parts: defenseActionData.parts.list,
            title: game.i18n.localize('SR6.DefenseTest'),
            incomingAttack: attack,
            combat: defenseActionData.combat
        });

        if (!roll) return;

        // Reduce initiative after a successful roll, but before attack handling, to allow for the standalone sheet
        // defense action to still reduce the initiative.
        if (defenseActionData.combat.initiative) {
            await this.changeCombatInitiative(defenseActionData.combat.initiative);
        }

        if (!attack) return;

        // Collect defense information.
        let defenderHits = roll.total;
        let attackerHits = attack.hits || 0;
        let netHits = Math.max(attackerHits - defenderHits, 0);

        // Reduce damage flow.
        let damage = attack.damage;

        // modified damage value by netHits.
        if (netHits > 0) {
            const {modified} = Helpers.modifyDamageByHits(damage, netHits, "SR6.NetHits");
            damage = modified;
        }

        const soakRollOptions = {
            event: options.event,
            damage,
        };

        await this.rollSoak(soakRollOptions);
    }

    async rollDirectSpellDefense(spell: SR6Item, options: SpellDefenseOptions): Promise<ShadowrunRoll | undefined> {
        if (!spell.isDirectCombatSpell()) return;

        // Prepare the actual roll.
        options.hideRollMessage = options.hideRollMessage ?? true;
        const attribute = spell.isManaSpell() ?
            SR.defense.spell.direct.mana :
            SR.defense.spell.direct.physical;

        const roll = await this.rollSingleAttribute(attribute, options);

        if (!roll) return;

        // Prepare the resulting damage message.
        const title = spell.isManaSpell() ?
            game.i18n.localize('SR6.SpellDefenseDirectMana') :
            game.i18n.localize('SR6.SpellDefenseDirectPhysical');
        const modificationLabel = 'SR6.SpellDefense';
        const actor = this;
        const damage = Helpers.reduceDamageByHits(options.attack.damage, roll.hits, modificationLabel);

        await createRollChatMessage({title, roll, actor, damage});

        return roll;
    }

    async rollIndirectSpellDefense(spell: SR6Item, options: SpellDefenseOptions): Promise<ShadowrunRoll | undefined> {
        if (!spell.isIndirectCombatSpell()) return;

        const opposedParts = spell.getOpposedTestMod();

        // TODO: indirect LOS spell defense works like a ranged weapon defense, but indirect LOS(A) spell defense
        //       work like grenade attack (no defense, but soak, with the threshold net hits modifying damage.)
        //       Grenades: SR6#181 Combat Spells: SR6#283
        return await this.rollAttackDefense(options, opposedParts.list);
    }

    // TODO: Abstract handling of const damage : ModifiedDamageData
    async rollSoak(options: SoakRollOptions, partsProps: ModList<number> = []): Promise<ShadowrunRoll|undefined> {
        return new SoakFlow().runSoakTest(this, options, partsProps);
    }

    rollSingleAttribute(attId, options: ActorRollOptions) {
        const attr = duplicate(this.data.data.attributes[attId]);
        const parts = new PartsList<number>();
        parts.addUniquePart(attr.label, attr.value);
        this._addMatrixParts(parts, attr);
        this._addGlobalParts(parts);

        return ShadowrunRoller.advancedRoll({
            actor: this,
            parts: parts.list,
            event: options?.event,
            title: options.title ?? Helpers.label(attId),
            hideRollMessage: options.hideRollMessage
        });
    }

    rollTwoAttributes([id1, id2], options: ActorRollOptions) {
        const attr1 = duplicate(this.data.data.attributes[id1]);
        const attr2 = duplicate(this.data.data.attributes[id2]);
        const label1 = Helpers.label(id1);
        const label2 = Helpers.label(id2);
        const parts = new PartsList<number>();
        parts.addPart(attr1.label, attr1.value);
        parts.addPart(attr2.label, attr2.value);
        this._addMatrixParts(parts, [attr1, attr2]);
        this._addGlobalParts(parts);

        return ShadowrunRoller.advancedRoll({
            actor: this,
            parts: parts.list,
            event: options?.event,
            title: options.title ?? `${label1} + ${label2}`,
            hideRollMessage: options.hideRollMessage
        });
    }

    rollNaturalRecovery(track, options?: ActorRollOptions) {
        if (!this.isCharacter()) return;

        let id1 = 'body';
        let id2 = 'willpower';
        let title = 'Natural Recover';
        if (track === 'physical') {
            id2 = 'body';
            title += ' - Physical - 1 Day';
        } else {
            title += ' - Stun - 1 Hour';
        }
        let att1 = duplicate(this.data.data.attributes[id1]);
        let att2 = duplicate(this.data.data.attributes[id2]);
        const parts = new PartsList<number>();
        parts.addPart(att1.label, att1.value);
        parts.addPart(att2.label, att2.value);

        return ShadowrunRoller.advancedRoll({
            event: options?.event,
            actor: this,
            parts: parts.list,
            title: title,
            extended: true,
            after: async (roll: ShadowrunRoll | undefined) => {
                if (!roll) return;
                let hits = roll.total;
                const data = this.data.data as CharacterActorData;
                let current = data.track[track].value;

                current = Math.max(current - hits, 0);

                let key = `data.track.${track}.value`;

                let u = {};
                u[key] = current;
                await this.update(u);
            },
        });
    }

    async rollMatrixAttribute(attr, options?: ActorRollOptions) {
        if (!("matrix" in this.data.data)) return;

        let matrix_att = duplicate(this.data.data.matrix[attr]);
        let title = game.i18n.localize(SR6.matrixAttributes[attr]);
        const parts = new PartsList<number>();
        parts.addPart(SR6.matrixAttributes[attr], matrix_att.value);

        if (options && options.event && options.event[SR6.kbmod.SPEC]) parts.addUniquePart('SR6.Specialization', 2);
        if (Helpers.hasModifiers(options?.event)) {
            return ShadowrunRoller.advancedRoll({
                event: options?.event,
                actor: this,
                parts: parts.list,
                title: title,
            });
        }
        const attributes = Helpers.filter(this.data.data.attributes, ([, value]) => value.value > 0);
        const attribute = 'willpower';

        let dialogData = {
            attribute: attribute,
            attributes: attributes,
        };
        const buttons = {
            roll: {
                label: 'Continue',
                callback: () => (cancel = false),
            },
        };

        let cancel = true;
        renderTemplate('systems/shadowrun6e/dist/templates/rolls/matrix-roll.html', dialogData).then((dlg) => {
            // @ts-ignore
            new Dialog({
                title: `${title} Test`,
                content: dlg,
                buttons: buttons,
                close: async (html) => {
                    if (cancel) return;
                    const newAtt = Helpers.parseInputToString($(html).find('[name=attribute]').val());
                    let att: AttributeField | undefined = undefined;
                    if (newAtt) {
                        att = this.data.data.attributes[newAtt];
                        title += ` + ${game.i18n.localize(SR6.attributes[newAtt])}`;
                    }
                    if (att !== undefined) {
                        if (att.value && att.label) parts.addPart(att.label, att.value);
                        this._addMatrixParts(parts, true);
                        this._addGlobalParts(parts);
                        return ShadowrunRoller.advancedRoll({
                            event: options?.event,
                            actor: this,
                            parts: parts.list,
                            title: title,
                        });
                    }
                },
            }).render(true);
        });
    }

    promptRoll(options?: ActorRollOptions) {
        const rollProps = {
            event: options?.event,
            title: 'Roll',
            parts: [],
            actor: this
        };
        const dialogOptions = {
            pool: true
        }
        return ShadowrunRoller.advancedRoll(rollProps, dialogOptions);
    }

    rollDeviceRating(options?: ActorRollOptions) {
        const title = game.i18n.localize('SR6.Labels.ActorSheet.DeviceRating');
        const parts = new PartsList<number>();
        const rating = this.getDeviceRating();
        // add device rating twice as this is the most common roll
        parts.addPart(title, rating);
        parts.addPart(title, rating);
        this._addGlobalParts(parts);
        return ShadowrunRoller.advancedRoll({
            event: options?.event,
            title,
            parts: parts.list,
            actor: this,
        });
    }

    rollAttributesTest(rollId, options?: ActorRollOptions) {
        const title = game.i18n.localize(SR6.attributeRolls[rollId]);
        const atts = this.data.data.attributes;
        const modifiers = this.data.data.modifiers;
        const parts = new PartsList<number>();
        if (rollId === 'composure') {
            parts.addUniquePart(atts.charisma.label, atts.charisma.value);
            parts.addUniquePart(atts.willpower.label, atts.willpower.value);
            if (modifiers.composure) parts.addUniquePart('SR6.Bonus', modifiers.composure);
        } else if (rollId === 'judge_intentions') {
            parts.addUniquePart(atts.charisma.label, atts.charisma.value);
            parts.addUniquePart(atts.intuition.label, atts.intuition.value);
            if (modifiers.judge_intentions) parts.addUniquePart('SR6.Bonus', modifiers.judge_intentions);
        } else if (rollId === 'lift_carry') {
            parts.addUniquePart(atts.strength.label, atts.strength.value);
            parts.addUniquePart(atts.body.label, atts.body.value);
            if (modifiers.lift_carry) parts.addUniquePart('SR6.Bonus', modifiers.lift_carry);
        } else if (rollId === 'memory') {
            parts.addUniquePart(atts.willpower.label, atts.willpower.value);
            parts.addUniquePart(atts.logic.label, atts.logic.value);
            if (modifiers.memory) parts.addUniquePart('SR6.Bonus', modifiers.memory);
        }

        this._addGlobalParts(parts);
        return ShadowrunRoller.advancedRoll({
            event: options?.event,
            actor: this,
            parts: parts.list,
            title: `${title} Test`,
        });
    }

    async rollSkill(skill: SkillField, options?: SkillRollOptions) {
        // NOTE: Currently defaulting happens at multiple places, which is why SkillFlow.handleDefaulting isn't used
        //       here, yet. A general skill usage clean up between Skill, Attribute and Item action handling is needed.
        if (!SkillFlow.allowRoll(skill)) {
            ui.notifications.warn(game.i18n.localize('SR6.Warnings.SkillCantBeDefault'));
            return;
        }

        // Legacy skills have a label, but no name. Custom skills have a name but no label.
        const label = skill.label ? game.i18n.localize(skill.label) : skill.name;
        const title = label;

        // Since options can provide an attribute, ignore incomplete sill attribute configuration.
        const attributeName = options?.attribute ? options.attribute : skill.attribute;
        const attribute = this.getAttribute(attributeName);
        if (!attribute) {
            ui.notifications.error(game.i18n.localize('SR6.Errors.SkillWithoutAttribute'));
            return;
        }
        let limit = attribute.limit ? this.getLimit(attribute.limit) : undefined;

        // Initialize parts with always needed skill data.
        const parts = new PartsList<number>();
        parts.addUniquePart(label, skill.value);
        this._addMatrixParts(parts, [attribute, skill]);
        this._addGlobalParts(parts);

        // Directly test, without further skill dialog.
        if (options?.event && Helpers.hasModifiers(options?.event)) {
            parts.addUniquePart(attribute.label, attribute.value);
            if (options.event[SR6.kbmod.SPEC]) parts.addUniquePart('SR6.Specialization', 2);

            return await ShadowrunRoller.advancedRoll({
                event: options.event,
                actor: this,
                parts: parts.list,
                limit,
                title: `${title} ${game.i18n.localize('SR6.Test')}`,
            });
        }

        // First ask user about skill details.
        const skillRollDialogOptions = {
            skill,
            attribute: attributeName
        }

        const skillDialog = await ShadowrunActorDialogs.createSkillDialog(this, skillRollDialogOptions, parts);
        const skillActionData = await skillDialog.select();

        if (skillDialog.canceled) return;

        return await ShadowrunRoller.advancedRoll({
            event: options?.event,
            actor: this,
            parts: skillActionData.parts.list,
            limit: skillActionData.limit,
            title: skillActionData.title,
        });
    }

    async rollDronePerception(options?: ActorRollOptions) {
        if (!this.isVehicle())
            return;

        const actorData = duplicate(this.data.data) as VehicleActorData;
        if (actorData.controlMode === 'autopilot') {
            const parts = new PartsList<number>();

            const pilot = Helpers.calcTotal(actorData.vehicle_stats.pilot);
            // TODO possibly look for autosoft item level?
            const perception = this.findActiveSkill('perception');
            const limit = this.findLimit('sensor');

            if (perception && limit) {
                parts.addPart('SR6.Vehicle.Clearsight', Helpers.calcTotal(perception));
                parts.addPart('SR6.Vehicle.Stats.Pilot', pilot);

                this._addGlobalParts(parts);

                return ShadowrunRoller.advancedRoll({
                    event: options?.event,
                    actor: this,
                    parts: parts.list,
                    limit,
                    title: game.i18n.localize('SR6.Labels.ActorSheet.RollDronePerception'),
                });
            }
        } else {
            await this.rollActiveSkill('perception', options);
        }
    }

    async rollPilotVehicle(options?: ActorRollOptions) {
        if (!this.isVehicle()) {
            return undefined;
        }
        const actorData = duplicate(this.data.data) as VehicleActorData;
        if (actorData.controlMode === 'autopilot') {
            const parts = new PartsList<number>();

            const pilot = Helpers.calcTotal(actorData.vehicle_stats.pilot);
            let skill: SkillField | undefined = this.getVehicleTypeSkill();
            const environment = actorData.environment;
            const limit = this.findLimit(environment);

            if (skill && limit) {
                parts.addPart('SR6.Vehicle.Stats.Pilot', pilot);
                // TODO possibly look for autosoft item level?
                parts.addPart('SR6.Vehicle.Maneuvering', Helpers.calcTotal(skill));

                this._addGlobalParts(parts);

                return await ShadowrunRoller.advancedRoll({
                    event: options?.event,
                    actor: this,
                    parts: parts.list,
                    limit,
                    title: game.i18n.localize('SR6.Labels.ActorSheet.RollPilotVehicleTest'),
                });
            }
        } else {
            const skillName = this.getVehicleTypeSkillName();
            if (!skillName) return;
            return await this.rollActiveSkill(skillName, options);
        }
    }

    async rollDroneInfiltration(options?: ActorRollOptions) {
        if (!this.isVehicle()) {
            return undefined;
        }
        const actorData = duplicate(this.data.data) as VehicleActorData;
        if (actorData.controlMode === 'autopilot') {
            const parts = new PartsList<number>();

            const pilot = Helpers.calcTotal(actorData.vehicle_stats.pilot);
            // TODO possibly look for autosoft item level?
            const sneaking = this.findActiveSkill('sneaking');
            const limit = this.findLimit('sensor');

            if (sneaking && limit) {
                parts.addPart('SR6.Vehicle.Stealth', Helpers.calcTotal(sneaking));
                parts.addPart('SR6.Vehicle.Stats.Pilot', pilot);

                this._addGlobalParts(parts);

                return ShadowrunRoller.advancedRoll({
                    event: options?.event,
                    actor: this,
                    parts: parts.list,
                    limit,
                    title: game.i18n.localize('SR6.Labels.ActorSheet.RollDroneInfiltration'),
                });
            }
        } else {
            await this.rollActiveSkill('sneaking', options);
        }
    }

    rollKnowledgeSkill(catId: string, skillId: string, options?: SkillRollOptions) {
        const category = duplicate(this.data.data.skills.knowledge[catId]);
        const skill = duplicate(category.value[skillId]);
        skill.attribute = category.attribute;
        skill.label = skill.name;
        return this.rollSkill(skill, options);
    }

    rollLanguageSkill(skillId: string, options?: SkillRollOptions) {
        const skill = duplicate(this.data.data.skills.language.value[skillId]);
        skill.attribute = 'intuition';
        skill.label = skill.name;
        return this.rollSkill(skill, options);
    }

    rollActiveSkill(skillId: string, options?: SkillRollOptions) {
        const skill = duplicate(this.data.data.skills.active[skillId]);
        return this.rollSkill(skill, options);
    }

    rollAttribute(attId, options?: ActorRollOptions) {
        let title = game.i18n.localize(SR6.attributes[attId]);
        const att = duplicate(this.data.data.attributes[attId]);
        const atts = duplicate(this.data.data.attributes);
        const parts = new PartsList<number>();
        parts.addPart(att.label, att.value);
        let dialogData = {
            attribute: att,
            attributes: atts,
        };
        let cancel = true;
        renderTemplate('systems/shadowrun6e/dist/templates/rolls/single-attribute.html', dialogData).then((dlg) => {
            new Dialog({
                title: `${title} Attribute Test`,
                content: dlg,
                buttons: {
                    roll: {
                        label: 'Continue',
                        callback: () => (cancel = false),
                    },
                },
                default: 'roll',
                close: async (html) => {
                    if (cancel) return;

                    const att2Id: string = Helpers.parseInputToString($(html).find('[name=attribute2]').val());
                    let att2: AttributeField | undefined = undefined;
                    if (att2Id !== 'none') {
                        att2 = atts[att2Id];
                        if (att2?.label) {
                            parts.addPart(att2.label, att2.value);
                            const att2IdLabel = game.i18n.localize(SR6.attributes[att2Id]);
                            title += ` + ${att2IdLabel}`;
                        }
                    }
                    if (att2Id === 'default') {
                        parts.addUniquePart('SR6.Defaulting', -1);
                    }
                    this._addMatrixParts(parts, [att, att2]);
                    this._addGlobalParts(parts);
                    return ShadowrunRoller.advancedRoll({
                        event: options?.event,
                        title: `${title} Test`,
                        actor: this,
                        parts: parts.list,
                    });
                },
            }).render(true);
        });
    }

    _addMatrixParts(parts: PartsList<number>, atts) {
        if (Helpers.isMatrix(atts)) {
            if (!("matrix" in this.data.data)) return;

            const matrix = this.data.data.matrix;
            if (matrix.hot_sim) parts.addUniquePart('SR6.HotSim', 2);
            if (matrix.running_silent) parts.addUniquePart('SR6.RunningSilent', -2);
        }
    }
    _addGlobalParts(parts: PartsList<number>) {
        if (this.data.data.modifiers.global) {
            parts.addUniquePart('SR6.Global', this.data.data.modifiers.global);
        }
    }

    _addDefenseParts(parts: PartsList<number>) {
        if (this.isVehicle()) {
            const pilot = this.findVehicleStat('pilot');
            if (pilot) {
                parts.addUniquePart(pilot.label, Helpers.calcTotal(pilot));
            }
            const skill = this.getVehicleTypeSkill();
            if (skill) {
                parts.addUniquePart('SR6.Vehicle.Maneuvering', Helpers.calcTotal(skill));
            }
        } else {
            const reaction = this.findAttribute('reaction');
            const intuition = this.findAttribute('intuition');

            if (reaction) {
                parts.addUniquePart(reaction.label || 'SR6.Reaction', reaction.value);
            }
            if (intuition) {
                parts.addUniquePart(intuition.label || 'SR6.Intuition', intuition.value);
            }
        }

        const mod = this.getModifier('defense');
        if (mod) {
            parts.addUniquePart('SR6.Bonus', mod);
        }
    }

    _addArmorParts(parts: PartsList<number>) {
        const armor = this.getArmor();
        if (armor) {
            parts.addUniquePart(armor.label || 'SR6.Armor', armor.base);
            for (let part of armor.mod) {
                parts.addUniquePart(part.name, part.value);
            }
        }
    }

    static async pushTheLimit(li) {
        let msg: ChatMessage = game.messages.get(li.data().messageId);

        if (msg.getFlag(SYSTEM_NAME, FLAGS.MessageCustomRoll)) {
            let actor = (msg.user.character as unknown) as SR6Actor;
            if (!actor) {
                const tokens = Helpers.getControlledTokens();
                if (tokens.length > 0) {
                    for (let token of tokens) {
                        // @ts-ignore // TODO: foundry-vtt-types not yet on 0.8
                        if (token.actor.isOwner) {
                            actor = token.actor as SR6Actor;
                            break;
                        }
                    }
                }
            }
            if (actor) {
                const parts = new PartsList<number>();
                parts.addUniquePart('SR6.PushTheLimit', actor.getEdge().value);
                ShadowrunRoller.basicRoll({
                    title: ` - ${game.i18n.localize('SR6.PushTheLimit')}`,
                    parts: parts.list,
                    actor: actor,
                }).then(() => {
                    actor.update({
                        'data.attributes.edge.uses': actor.getEdge().uses - 1,
                    });
                });
            } else {
                // @ts-ignore
                ui.notifications.warn(game.i18n.localize('SR6.SelectTokenMessage'));
            }
        }
    }

    static async secondChance(li) {
        let msg: ChatMessage = game.messages.get(li.data().messageId);
        // @ts-ignore
        let roll: Roll = JSON.parse(msg.data?.roll);
        let formula = roll.formula;
        let hits = roll.total;
        let re = /(\d+)d6/;
        let matches = formula.match(re);
        if (matches && matches[1]) {
            let match = matches[1];
            let pool = parseInt(match.replace('d6', ''));
            if (!isNaN(pool) && !isNaN(hits)) {
                let actor = (msg.user.character as unknown) as SR6Actor;
                if (!actor) {
                    const tokens = Helpers.getControlledTokens();
                    if (tokens.length > 0) {
                        for (let token of tokens) {
                            // @ts-ignore // TODO: foundry-vtt-types not yet on 0.8
                            if (token.actor.isOwner) {
                                actor = token.actor as SR6Actor;
                                break;
                            }
                        }
                    }
                }
                if (actor) {
                    const parts = new PartsList<number>();
                    parts.addUniquePart('SR6.OriginalDicePool', pool);
                    parts.addUniquePart('SR6.Successes', -hits);

                    return ShadowrunRoller.basicRoll({
                        title: ` - Second Chance`,
                        parts: parts.list,
                        actor: actor,
                    }).then(() => {
                        actor.useEdge();
                    });
                } else {
                    // @ts-ignore
                    ui.notifications.warn(game.i18n.localize('SR6.SelectTokenMessage'));
                }
            }
        }
    }

    /**
     * Override setFlag to remove the 'SR6.' from keys in modlists, otherwise it handles them as embedded keys
     * @param scope
     * @param key
     * @param value
     */
    setFlag(scope: string, key: string, value: any): Promise<any> {
        const newValue = Helpers.onSetFlag(value);
        return super.setFlag(scope, key, newValue);
    }

    /**
     * Override getFlag to add back the 'SR6.' keys correctly to be handled
     * @param scope
     * @param key
     */
    getFlag(scope: string, key: string): any {
        const data = super.getFlag(scope, key);
        return Helpers.onGetFlag(data);
    }

    /** Return either the linked token or the token of the synthetic actor.
     *
     * @retrun Will return null should no token have been placed on scene.
     */
    getToken(): Token {
        // Linked actors can only have one token, which isn't stored within actor data...
        if (this._isLinkedToToken() && this.hasToken()) {
            const linked = true;
            const tokens = this.getActiveTokens(linked);
            // This assumes for a token to exist and should fail if not.
            return tokens[0];
        }

        // Unlinked actors can have multiple active token but each have theirs directly attached...
        return this.token;
    }

    /**
     * There is no need for a token to placed. The prototype token is enough.
     */
    _isLinkedToToken(): boolean {
        //@ts-ignore
        // If an actor is linked, all it's copies also contain this linked status, even if they're not.
        return this.data.token.actorLink && !this.token;
    }

    hasToken(): boolean {
        return this.getActiveTokens().length > 0;
    }

    hasActivePlayerOwner(): boolean {
        const players = this.getActivePlayerOwners();
        return players.length > 0;
    }

    getActivePlayer(): User|null {
        //@ts-ignore
        if (!this.hasPlayerOwner) {
            return null;
        }

        // @ts-ignore // TODO: foundry-vtt-types Does not support DocumentCollection yet.
        for (const user of game.users.contents) {
            if (!user.active || user.isGM) {
                continue;
            }
            if (this.id === user.character.id) {
                return user;
            }
        }

        return null;
    }

    getActivePlayerOwners(): User[] {
        return Helpers.getPlayersWithPermission(this, 'OWNER', true);
    }

    __addDamageToTrackValue(damage: DamageData, track: TrackType|OverflowTrackType|ConditionData): TrackType|OverflowTrackType|ConditionData {
        if (damage.value === 0) return track;
        if (track.value === track.max) return track;

        //  Avoid cross referencing.
        // @ts-ignore
        track = duplicate(track);

        track.value += damage.value;
        if (track.value > track.max) {
            // dev error, not really meant to be ever seen by users. Therefore no localization.
            console.error("Damage did overflow the track, which shouldn't happen at this stage. Damage has been set to max. Please use applyDamage.")
            track.value = track.max;
        }

        return track;
    }

    async _addDamageToDeviceTrack(damage: DamageData, device: SR6Item) {
        if (!device) return;

        let condition = device.getCondition();
        if (!condition) return damage;

        if (damage.value === 0) return;
        if (condition.value === condition.max) return;

        condition = this.__addDamageToTrackValue(damage, condition);

        const data = {['data.technology.condition_monitor']: condition};
        await device.update(data);
    }

    async _addDamageToTrack(damage: DamageData, track: TrackType|OverflowTrackType|ConditionData) {
        if (damage.value === 0) return;
        if (track.value === track.max) return;

        track = this.__addDamageToTrackValue(damage, track);
        // //  Avoid cross referencing.
        // track = duplicate(track);
        //
        // track.value += damage.value;
        // if (track.value > track.max) {
        //     // dev error, not really meant to be ever seen by users. Therefore no localization.
        //     console.error("Damage did overflow the track, which shouldn't happen at this stage. Damage has been set to max. Please use applyDamage.")
        //     track.value = track.max;
        // }

        const data = {[`data.track.${damage.type.value}`]: track};
        await this.update(data);
    }

    async _addDamageToOverflow(damage: DamageData, track: OverflowTrackType) {
        if (damage.value === 0) return;
        if (track.overflow.value === track.overflow.max) return;

        //  Avoid cross referencing.
        const overflow = duplicate(track.overflow);

        // Don't over apply damage to the track overflow.
        overflow.value += damage.value;
        overflow.value = Math.min(overflow.value, overflow.max);

        const data = {[`data.track.${damage.type.value}.overflow`]: overflow};
        await this.update(data);
    }

    /** Apply damage to the stun track and get overflow damage for the physical track.
     */
    async addStunDamage(damage: DamageData): Promise<DamageData> {
        if (damage.type.value !== 'stun') return damage;

        const track = this.getStunTrack();
        if (!track)
            return damage;

        const {overflow, rest} = this._calcDamageOverflow(damage, track);

        // Only change damage type when needed, in order to avoid confusion of callers.
        if (overflow.value > 0) {
            // Apply Stun overflow damage to physical track according to: SR6E#170
            overflow.value = Math.floor(overflow.value / 2);
            overflow.type.value = 'physical';
        }

        await this._addDamageToTrack(rest, track);
        return overflow;
    }

    async addPhysicalDamage(damage: DamageData) {
        if (damage.type.value !== 'physical') return damage;

        const track = this.getPhysicalTrack();
        if (!track)
            return damage;

        const {overflow, rest} = this._calcDamageOverflow(damage, track);

        await this._addDamageToTrack(rest, track);
        await this._addDamageToOverflow(overflow, track);
    }

    /** Adding damage to a device track instead of an actors track, as they contain their own track within their data.
     */
    async addMatrixDamage(damage: DamageData): Promise<DamageData> {
        if (damage.type.value !== 'matrix') return damage;

        const device = this.getMatrixDevice();
        if (!device) return damage;

        const track = this.getMatrixTrack();
        // Actor might not have a commlink/cyberdeck equipped.
        if (!track) return damage;

        const {overflow, rest} = this._calcDamageOverflow(damage, track);

        await this._addDamageToDeviceTrack(rest, device);

        // Return overflow for consistency, yet nothing will take overflowing matrix damage.
        return overflow;
    }

    /** Calculate damage overflow only based on max and current track values.
     */
    _calcDamageOverflow(damage: DamageData, track: TrackType|ConditionData): {overflow: DamageData, rest: DamageData} {
        const freeTrackDamage = track.max - track.value;
        const overflowDamage = damage.value > freeTrackDamage ?
            damage.value - freeTrackDamage :
            0;
        const restDamage = damage.value - overflowDamage;

        //  Avoid cross referencing.
        const overflow = duplicate(damage);
        const rest = duplicate(damage);

        overflow.value = overflowDamage;
        rest.value = restDamage;

        // @ts-ignore
        return {overflow, rest};
    }

    getStunTrack(): TrackType | undefined {
        if ("track" in this.data.data && "stun" in this.data.data.track)
            return this.data.data.track.stun;
    }

    getPhysicalTrack(): OverflowTrackType | undefined {
        if ("track" in this.data.data)
            return this.data.data.track.physical;
    }

    getMatrixTrack(): ConditionData|undefined {
        const device = this.getMatrixDevice();
        if (!device) return undefined;

        return device.getCondition();
    }

    getModifiedArmor(damage: DamageData): ActorArmorData {
        if (!damage.ap?.value) {
            return this.getArmor();
       }

        const modified = duplicate(this.getArmor());
        if (modified) {
            // @ts-ignore
            modified.mod = PartsList.AddUniquePart(modified.mod, 'SR6.DV', damage.ap.value);
            // @ts-ignore
            modified.value = Helpers.calcTotal(modified, {min: 0});
        }

        // @ts-ignore
        return modified;
    }

    /** Reduce the initiative of the actor in the currently open / selected combat.
     * Should a tokens actor be in multiple combats it will also only affect the currently open combat,
     * since that is what's set in game.combat
     *
     * TODO: There is an issue with linked actors that have multiple tokens placed, with each in different combats.
     *       The defense test needs to be done using the correct token, not just by the actor (from the sidebar).
     *       One could argue this to be correct behavior, just confusing with normal linked actor / token usage.
     */
    async changeCombatInitiative(modifier: number) {
        // No change needed for nothing to change.
        if (modifier === 0) return;

        const combat: SR6Combat = game.combat as SR6Combat;
        const combatant = combat.getActorCombatant(this);

        // Token might not be part of active combat.
        if (!combatant) return;

        await combat.adjustInitiative(combatant, modifier);
    }

    hasDamageTracks(): boolean {
        return "track" in this.data.data;
    }

    asVehicleData(): SR6VehicleType | undefined {
        if (this.isVehicle())
            return this.data as SR6VehicleType;
    }

    asCharacterData(): SR6CharacterType | undefined {
        if (this.isCharacter())
            return this.data as SR6CharacterType;
    }

    asSpiritData(): SR6SpiritType | undefined {
        if (this.isSpirit()) {
            return this.data as SR6SpiritType;
        }
    }

    asSpriteData(): SR6SpriteType | undefined {
        if (this.isSprite()) {
            return this.data as SR6SpriteType;
        }
    }

    asCritterData(): SR6CritterType | undefined {
        if (this.isCritter()){
            return this.data as SR6CritterType;
        }
    }

    getVehicleStats(): VehicleStats | undefined {
        if (this.isVehicle() && "vehicle_stats" in this.data.data) {
            return this.data.data.vehicle_stats;
        }
    }

    /** Add another actor as the driver of a vehicle to allow for their values to be used in testing.
     *
     * @param id An actors id. Should be a character able to drive a vehicle
     */
    async addVehicleDriver(id: string) {
        if (!this.isVehicle()) return;

        const driver = game.actors.get(id) as SR6Actor;
        if (!driver) return;

        // NOTE: In THEORY almost all actor types can drive a vehicle.
        // ... drek, in theory a drone could drive another vehicle even...

        await this.update({'data.driver': driver.id});
    }

    async removeVehicleDriver() {
        if (!this.hasDriver()) return;

        await this.update({'data.driver': ''});
    }

    hasDriver(): boolean {
        const data = this.asVehicleData();

        if (!data) return false;
        return data.data.driver.length > 0;
    }

    getVehicleDriver(): SR6Actor|undefined {
        if (!this.hasDriver()) return;
        const data = this.asVehicleData();
        if (!data) return;

        const driver = game.actors.get(data.data.driver) as SR6Actor;
        // If no driver id is set, we won't get an actor and should explicitly return undefined.
        if (!driver) return;
        return driver;
    }

    /** Check if this actor is of one or multiple given actor types
     *
     * @param types A list of actor types to check.
     */
    matchesActorTypes(types: string[]): boolean {
        return types.includes(this.data.type);
    }

    /** TODO: method documentation
     *
     * @param ignoreScene Set to true to ignore modifiers set on active or given scene.
     * @param scene Should a scene be used as a fallback, provide this here. Otherwise current scene will be used.
     */
    // @ts-ignore
    async getModifiers(ignoreScene: boolean=false, scene: Scene=canvas.scene): Promise<Modifiers> {
        const onActor = await Modifiers.getModifiersFromEntity(this);

        if (onActor.hasActiveEnvironmental) {
            return onActor;
        // No open scene, or scene ignored.
        } else if (ignoreScene || scene === null) {
            return new Modifiers(Modifiers.getDefaultModifiers());
        } else {
            return await Modifiers.getModifiersFromEntity(scene);
        }
    }

    async setModifiers(modifiers: Modifiers) {
        await Modifiers.setModifiersOnEntity(this, modifiers.modifiers);
    }
}
