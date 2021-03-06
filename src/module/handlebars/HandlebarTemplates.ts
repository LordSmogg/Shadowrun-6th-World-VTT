export const preloadHandlebarsTemplates = async () => {
    const templatePaths = [
        // actor tabs
        'systems/shadowrun6e/dist/templates/actor/tabs/ActionsTab.html',
        'systems/shadowrun6e/dist/templates/actor/tabs/BioTab.html',
        'systems/shadowrun6e/dist/templates/actor/tabs/GearTab.html',
        'systems/shadowrun6e/dist/templates/actor/tabs/MagicTab.html',
        'systems/shadowrun6e/dist/templates/actor/tabs/MatrixTab.html',
        'systems/shadowrun6e/dist/templates/actor/tabs/MiscTab.html',
        'systems/shadowrun6e/dist/templates/actor/tabs/SkillsTab.html',
        'systems/shadowrun6e/dist/templates/actor/tabs/SocialTab.html',
        'systems/shadowrun6e/dist/templates/actor/tabs/SpellsTab.html',
        'systems/shadowrun6e/dist/templates/actor/tabs/CritterPowersTab.html',

        'systems/shadowrun6e/dist/templates/actor/tabs/spirit/SpiritSkillsTab.html',

        'systems/shadowrun6e/dist/templates/actor/tabs/matrix/SpriteSkillsTab.html',

        'systems/shadowrun6e/dist/templates/actor/tabs/vehicle/VehicleSkillsTab.html',
        'systems/shadowrun6e/dist/templates/actor/tabs/vehicle/VehicleMatrixTab.html',

        // uncategorized lists
        'systems/shadowrun6e/dist/templates/actor/parts/Initiative.html',
        'systems/shadowrun6e/dist/templates/actor/parts/Movement.html',
        'systems/shadowrun6e/dist/templates/actor/parts/ProfileImage.html',
        'systems/shadowrun6e/dist/templates/actor/parts/NameInput.html',
        'systems/shadowrun6e/dist/templates/actor/parts/ActionList.html',
        'systems/shadowrun6e/dist/templates/actor/parts/ContactList.html',
        'systems/shadowrun6e/dist/templates/actor/parts/SinAndLifestyleList.html',

        // magic
        'systems/shadowrun6e/dist/templates/actor/parts/magic/AdeptPowerList.html',
        'systems/shadowrun6e/dist/templates/actor/parts/magic/SpellList.html',
        'systems/shadowrun6e/dist/templates/actor/parts/magic/SpellAndAdeptPowerList.html',
        'systems/shadowrun6e/dist/templates/actor/parts/magic/SpiritOptions.html',

        // matrix
        'systems/shadowrun6e/dist/templates/actor/parts/matrix/ProgramList.html',
        'systems/shadowrun6e/dist/templates/actor/parts/matrix/ComplexFormList.html',
        'systems/shadowrun6e/dist/templates/actor/parts/matrix/MatrixAttribute.html',
        'systems/shadowrun6e/dist/templates/actor/parts/matrix/SpritePowerList.html',
        'systems/shadowrun6e/dist/templates/actor/parts/matrix/DeviceRating.html',

        // attributes
        'systems/shadowrun6e/dist/templates/actor/parts/attributes/Attribute.html',
        'systems/shadowrun6e/dist/templates/actor/parts/attributes/AttributeList.html',
        'systems/shadowrun6e/dist/templates/actor/parts/attributes/SpecialAttributeList.html',
        'systems/shadowrun6e/dist/templates/actor/parts/attributes/Limits.html',

        // skills
        'systems/shadowrun6e/dist/templates/actor/parts/skills/ActiveSkillList.html',
        'systems/shadowrun6e/dist/templates/actor/parts/skills/LanguageAndKnowledgeSkillList.html',

        // vehicle
        'systems/shadowrun6e/dist/templates/actor/parts/vehicle/VehicleStatsList.html',
        'systems/shadowrun6e/dist/templates/actor/parts/vehicle/VehicleSecondStatsList.html',
        'systems/shadowrun6e/dist/templates/actor/parts/vehicle/VehicleMovement.html',

        // limited actor
        'systems/shadowrun6e/dist/templates/actor-limited/character.html',
        'systems/shadowrun6e/dist/templates/actor-limited/spirit.html',
        'systems/shadowrun6e/dist/templates/actor-limited/sprite.html',
        'systems/shadowrun6e/dist/templates/actor-limited/vehicle.html',
        'systems/shadowrun6e/dist/templates/actor-limited/critter.html',
        'systems/shadowrun6e/dist/templates/actor-limited/parts/Header.html',
        'systems/shadowrun6e/dist/templates/actor-limited/parts/MiscCharacter.html',
        'systems/shadowrun6e/dist/templates/actor-limited/parts/MiscSpirit.html',
        'systems/shadowrun6e/dist/templates/actor-limited/parts/MiscSprite.html',
        'systems/shadowrun6e/dist/templates/actor-limited/parts/MiscVehicle.html',
        'systems/shadowrun6e/dist/templates/actor-limited/parts/MiscCritter.html',


        'systems/shadowrun6e/dist/templates/item/parts/description.html',
        'systems/shadowrun6e/dist/templates/item/parts/technology.html',
        'systems/shadowrun6e/dist/templates/item/parts/header.html',
        'systems/shadowrun6e/dist/templates/item/parts/weapon-ammo-list.html',
        'systems/shadowrun6e/dist/templates/item/parts/weapon-mods-list.html',
        'systems/shadowrun6e/dist/templates/item/parts/action.html',
        'systems/shadowrun6e/dist/templates/item/parts/damage.html',
        'systems/shadowrun6e/dist/templates/item/parts/opposed.html',
        'systems/shadowrun6e/dist/templates/item/parts/spell.html',
        'systems/shadowrun6e/dist/templates/item/parts/complex_form.html',
        'systems/shadowrun6e/dist/templates/item/parts/weapon.html',
        'systems/shadowrun6e/dist/templates/item/parts/armor.html',
        'systems/shadowrun6e/dist/templates/item/parts/matrix.html',
        'systems/shadowrun6e/dist/templates/item/parts/sin.html',
        'systems/shadowrun6e/dist/templates/item/parts/contact.html',
        'systems/shadowrun6e/dist/templates/item/parts/lifestyle.html',
        'systems/shadowrun6e/dist/templates/item/parts/ammo.html',
        'systems/shadowrun6e/dist/templates/item/parts/modification.html',
        'systems/shadowrun6e/dist/templates/item/parts/program.html',
        'systems/shadowrun6e/dist/templates/item/parts/critter_power.html',
        'systems/shadowrun6e/dist/templates/rolls/parts/parts-list.html',
        'systems/shadowrun6e/dist/templates/rolls/parts/Damage.html',

        // to wrap the bodies of tabs
        'systems/shadowrun6e/dist/templates/common/TabWrapper.html',
        'systems/shadowrun6e/dist/templates/common/ValueInput.html',

        // Useful wrapper and implemented components
        'systems/shadowrun6e/dist/templates/common/ValueMaxAttribute.html',
        'systems/shadowrun6e/dist/templates/common/Attribute.html',
        'systems/shadowrun6e/dist/templates/common/ValueModifiers.html',

        // useful select template for the common pattern
        'systems/shadowrun6e/dist/templates/common/Select.html',

        // to create the condition monitors and edge counter
        'systems/shadowrun6e/dist/templates/common/HorizontalCellInput.html',

        // looks like a ListHeader
        'systems/shadowrun6e/dist/templates/common/HeaderBlock.html',

        'systems/shadowrun6e/dist/templates/common/NameLineBlock.html',

        // list components
        'systems/shadowrun6e/dist/templates/common/List/ListItem.html',
        'systems/shadowrun6e/dist/templates/common/List/ListHeader.html',

        // dialogs
        'systems/shadowrun6e/dist/templates/apps/dialogs/damage-application.html',
    ];

    return loadTemplates(templatePaths);
};
