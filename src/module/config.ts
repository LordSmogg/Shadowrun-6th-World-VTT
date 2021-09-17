export const SR6 = {
    itemTypes: {
        action: 'SR6.ItemTypes.Action',
        adept_power: 'SR6.ItemTypes.AdeptPower',
        ammo: 'SR6.ItemTypes.Ammo',
        armor: 'SR6.ItemTypes.Armor',
        complex_form: 'SR6.ItemTypes.ComplexForm',
        contact: 'SR6.ItemTypes.Contact',
        critter_power: 'SR6.ItemTypes.CritterPower',
        cyberware: 'SR6.ItemTypes.Cyberware',
        bioware: 'SR6.ItemTypes.Bioware',
        device: 'SR6.ItemTypes.Device',
        equipment: 'SR6.ItemTypes.Equipment',
        lifestyle: 'SR6.ItemTypes.Lifestyle',
        modification: 'SR6.ItemTypes.Modification',
        quality: 'SR6.ItemTypes.Quality',
        sin: 'SR6.ItemTypes.Sin',
        spell: 'SR6.ItemTypes.Spell',
        weapon: 'SR6.ItemTypes.Weapon',
    },

    attributes: {
        body: 'SR6.AttrBody',
        agility: 'SR6.AttrAgility',
        reaction: 'SR6.AttrReaction',
        strength: 'SR6.AttrStrength',
        willpower: 'SR6.AttrWillpower',
        logic: 'SR6.AttrLogic',
        intuition: 'SR6.AttrIntuition',
        charisma: 'SR6.AttrCharisma',
        magic: 'SR6.AttrMagic',
        resonance: 'SR6.AttrResonance',
        edge: 'SR6.AttrEdge',
        essence: 'SR6.AttrEssence',
        attack: 'SR6.MatrixAttrAttack',
        sleaze: 'SR6.MatrixAttrSleaze',
        data_processing: 'SR6.MatrixAttrDataProc',
        firewall: 'SR6.MatrixAttrFirewall',
    },

    limits: {
        physical: 'SR6.LimitPhysical',
        social: 'SR6.LimitSocial',
        mental: 'SR6.LimitMental',
        attack: 'SR6.MatrixAttrAttack',
        sleaze: 'SR6.MatrixAttrSleaze',
        data_processing: 'SR6.MatrixAttrDataProc',
        firewall: 'SR6.MatrixAttrFirewall',
    },

    specialTypes: {
        mundane: 'SR6.Mundane',
        magic: 'SR6.Awakened',
        resonance: 'SR6.Emerged',
    },

    damageTypes: {
        physical: 'SR6.DmgTypePhysical',
        stun: 'SR6.DmgTypeStun',
        matrix: 'SR6.DmgTypeMatrix',
    },

    elementTypes: {
        fire: 'SR6.ElementFire',
        cold: 'SR6.ElementCold',
        acid: 'SR6.ElementAcid',
        electricity: 'SR6.ElementElectricity',
        radiation: 'SR6.ElementRadiation',
    },

    spellCategories: {
        combat: 'SR6.SpellCatCombat',
        detection: 'SR6.SpellCatDetection',
        health: 'SR6.SpellCatHealth',
        illusion: 'SR6.SpellCatIllusion',
        manipulation: 'SR6.SpellCatManipulation',
    },

    spellTypes: {
        physical: 'SR6.SpellTypePhysical',
        mana: 'SR6.SpellTypeMana',
    },

    spellRanges: {
        touch: 'SR6.SpellRangeTouch',
        los: 'SR6.SpellRangeLos',
        los_a: 'SR6.SpellRangeLosA',
    },

    combatSpellTypes: {
        direct: 'SR6.SpellCombatDirect',
        indirect: 'SR6.SpellCombatIndirect',
    },

    detectionSpellTypes: {
        directional: 'SR6.SpellDetectionDirectional',
        psychic: 'SR6.SpellDetectionPsychic',
        area: 'SR6.SpellDetectionArea',
    },

    illusionSpellTypes: {
        obvious: 'SR6.SpellIllusionObvious',
        realistic: 'SR6.SpellIllusionRealistic',
    },

    illusionSpellSenses: {
        'single-sense': 'SR6.SpellIllusionSingleSense',
        'multi-sense': 'SR6.SpellIllusionMultiSense',
    },

    attributeRolls: {
        composure: 'SR6.RollComposure',
        lift_carry: 'SR6.RollLiftCarry',
        judge_intentions: 'SR6.RollJudgeIntentions',
        memory: 'SR6.RollMemory',
    },

    matrixTargets: {
        persona: 'SR6.TargetPersona',
        device: 'SR6.TargetDevice',
        file: 'SR6.TargetFile',
        self: 'SR6.TargetSelf',
        sprite: 'SR6.TargetSprite',
        other: 'SR6.TargetOther',
    },

    durations: {
        instant: 'SR6.DurationInstant',
        sustained: 'SR6.DurationSustained',
        permanent: 'SR6.DurationPermanent',
    },

    weaponCategories: {
        range: 'SR6.WeaponCatRange',
        melee: 'SR6.WeaponCatMelee',
        thrown: 'SR6.WeaponCatThrown',
    },

    weaponRanges: {
        close: 'SR6.WeaponRangeClose',
        near: 'SR6.WeaponRangeNear',
        medium: 'SR6.WeaponRangeMedium',
        far: 'SR6.WeaponRangeFar',
        extreme: 'SR6.WeaponRangeExtreme',
    },

    qualityTypes: {
        positive: 'SR6.QualityTypePositive',
        negative: 'SR6.QualityTypeNegative',
    },

    adeptPower: {
        types: {
            active: 'SR6.AdeptPower.Types.Active',
            passive: 'SR6.AdeptPower.Types.Passive',
        },
    },

    deviceCategories: {
        commlink: 'SR6.DeviceCatCommlink',
        cyberdeck: 'SR6.DeviceCatCyberdeck',
    },

    cyberwareGrades: {
        standard: 'SR6.CyberwareGradeStandard',
        alpha: 'SR6.CyberwareGradeAlpha',
        beta: 'SR6.CyberwareGradeBeta',
        delta: 'SR6.CyberwareGradeDelta',
        used: 'SR6.CyberwareGradeUsed',
    },

    knowledgeSkillCategories: {
        street: 'SR6.KnowledgeSkillStreet',
        academic: 'SR6.KnowledgeSkillAcademic',
        professional: 'SR6.KnowledgeSkillProfessional',
        interests: 'SR6.KnowledgeSkillInterests',
    },

    activeSkills: {
        archery: 'SR6.SkillArchery',
        automatics: 'SR6.SkillAutomatics',
        blades: 'SR6.SkillBlades',
        clubs: 'SR6.SkillClubs',
        exotic_melee: 'SR6.SkillExoticMelee',
        exotic_range: 'SR6.SkillExoticRange',
        heavy_weapons: 'SR6.SkillHeavyWeapons',
        longarms: 'SR6.SkillLongarms',
        pistols: 'SR6.SkillPistols',
        throwing_weapons: 'SR6.SkillThrowingWeapons',
        unarmed_combat: 'SR6.SkillUnarmedCombat',
        disguise: 'SR6.SkillDisguise',
        diving: 'SR6.SkillDiving',
        escape_artist: 'SR6.SkillEscapeArtist',
        free_fall: 'SR6.SkillFreeFall',
        gymnastics: 'SR6.SkillGymnastics',
        palming: 'SR6.SkillPalming',
        perception: 'SR6.SkillPerception',
        running: 'SR6.SkillRunning',
        sneaking: 'SR6.SkillSneaking',
        survival: 'SR6.SkillSurvival',
        swimming: 'SR6.SkillSwimming',
        tracking: 'SR6.SkillTracking',
        con: 'SR6.SkillCon',
        etiquette: 'SR6.SkillEtiquette',
        impersonation: 'SR6.SkillImpersonation',
        instruction: 'SR6.SkillInstruction',
        intimidation: 'SR6.SkillIntimidation',
        leadership: 'SR6.SkillLeadership',
        negotiation: 'SR6.SkillNegotiation',
        performance: 'SR6.SkillPerformance',
        alchemy: 'SR6.SkillAlchemy',
        arcana: 'SR6.SkillArcana',
        artificing: 'SR6.SkillArtificing',
        assensing: 'SR6.SkillAssensing',
        astral_combat: 'SR6.SkillAstralCombat',
        banishing: 'SR6.SkillBanishing',
        binding: 'SR6.SkillBinding',
        counterspelling: 'SR6.SkillCounterspelling',
        disenchanting: 'SR6.SkillDisenchanting',
        ritual_spellcasting: 'SR6.SkillRitualSpellcasting',
        spellcasting: 'SR6.SkillSpellcasting',
        summoning: 'SR6.SkillSummoning',
        compiling: 'SR6.SkillCompiling',
        decompiling: 'SR6.SkillDecompiling',
        registering: 'SR6.SkillRegistering',
        aeronautics_mechanic: 'SR6.SkillAeronauticsMechanic',
        automotive_mechanic: 'SR6.SkillAutomotiveMechanic',
        industrial_mechanic: 'SR6.SkillIndustrialMechanic',
        nautical_mechanic: 'SR6.SkillNauticalMechanic',
        animal_handling: 'SR6.SkillAnimalHandling',
        armorer: 'SR6.SkillArmorer',
        artisan: 'SR6.SkillArtisan',
        biotechnology: 'SR6.SkillBiotechnology',
        chemistry: 'SR6.SkillChemistry',
        computer: 'SR6.SkillComputer',
        cybercombat: 'SR6.SkillCybercombat',
        cybertechnology: 'SR6.SkillCybertechnology',
        demolitions: 'SR6.SkillDemolitions',
        electronic_warfare: 'SR6.SkillElectronicWarfare',
        first_aid: 'SR6.SkillFirstAid',
        forgery: 'SR6.SkillForgery',
        hacking: 'SR6.SkillHacking',
        hardware: 'SR6.SkillHardware',
        locksmith: 'SR6.SkillLocksmith',
        medicine: 'SR6.SkillMedicine',
        navigation: 'SR6.SkillNavigation',
        software: 'SR6.SkillSoftware',
        gunnery: 'SR6.SkillGunnery',
        pilot_aerospace: 'SR6.SkillPilotAerospace',
        pilot_aircraft: 'SR6.SkillPilotAircraft',
        pilot_walker: 'SR6.SkillPilotWalker',
        pilot_ground_craft: 'SR6.SkillPilotGroundCraft',
        pilot_water_craft: 'SR6.SkillPilotWaterCraft',
        pilot_exotic_vehicle: 'SR6.SkillPilotExoticVehicle',
    },

    actionTypes: {
        none: 'SR6.ActionTypeNone',
        free: 'SR6.ActionTypeFree',
        simple: 'SR6.ActionTypeSimple',
        complex: 'SR6.ActionTypeComplex',
        varies: 'SR6.ActionTypeVaries',
    },

    // Use within action damage calculation (base <operator> attribute) => value
    actionDamageFormulaOperators: {
        add: '+',
        subtract: '-',
        multiply: '*',
        divide: '/'
    },

    matrixAttributes: {
        attack: 'SR6.MatrixAttrAttack',
        sleaze: 'SR6.MatrixAttrSleaze',
        data_processing: 'SR6.MatrixAttrDataProc',
        firewall: 'SR6.MatrixAttrFirewall',
    },

    initiativeCategories: {
        meatspace: 'SR6.InitCatMeatspace',
        astral: 'SR6.InitCatAstral',
        matrix: 'SR6.InitCatMatrix',
    },

    modificationTypes: {
        weapon: 'SR6.Weapon',
        armor: 'SR6.Armor',
    },

    mountPoints: {
        barrel: 'SR6.Barrel',
        under_barrel: 'SR6.UnderBarrel',
        stock: 'SR6.Stock',
        top: 'SR6.Top',
        side: 'SR6.Side',
        internal: 'SR6.Internal',
    },

    lifestyleTypes: {
        street: 'SR6.LifestyleStreet',
        squatter: 'SR6.LifestyleSquatter',
        low: 'SR6.LifestyleLow',
        medium: 'SR6.LifestyleMiddle',
        high: 'SR6.LifestyleHigh',
        luxory: 'SR6.LifestyleLuxory',
        other: 'SR6.LifestyleOther',
    },

    kbmod: {
        STANDARD: 'shiftKey',
        EDGE: 'altKey',
        SPEC: 'ctrlKey',
    },

    actorModifiers: {
        soak: 'SR6.RollSoak',
        drain: 'SR6.Drain',
        armor: 'SR6.Armor',
        physical_limit: 'SR6.PhysicalLimit',
        social_limit: 'SR6.SocialLimit',
        mental_limit: 'SR6.MentalLimit',
        stun_track: 'SR6.StunTrack',
        physical_track: 'SR6.PhysicalTrack',
        meat_initiative: 'SR6.MeatSpaceInit',
        meat_initiative_dice: 'SR6.MeatSpaceDice',
        astral_initiative: 'SR6.AstralInit',
        astral_initiative_dice: 'SR6.AstralDice',
        matrix_initiative: 'SR6.MatrixInit',
        matrix_initiative_dice: 'SR6.MatrixDice',
        composure: 'SR6.RollComposure',
        lift_carry: 'SR6.RollLiftCarry',
        judge_intentions: 'SR6.RollJudgeIntentions',
        memory: 'SR6.RollMemory',
        walk: 'SR6.Walk',
        run: 'SR6.Run',
        defense: 'SR6.RollDefense',
        wound_tolerance: 'SR6.WoundTolerance',
        essence: 'SR6.AttrEssence',
        fade: 'SR6.RollFade',
        global: 'SR6.Global',
    },

    programTypes: {
        common_program: 'SR6.CommonProgram',
        hacking_program: 'SR6.HackingProgram',
        agent: 'SR6.Agent',
    },

    spiritTypes: {
        // base types
        air: 'SR6.Spirit.Types.Air',
        aircraft: 'SR6.Spirit.Types.Aircraft',
        airwave: 'SR6.Spirit.Types.Airwave',
        automotive: 'SR6.Spirit.Types.Automotive',
        beasts: 'SR6.Spirit.Types.Beasts',
        ceramic: 'SR6.Spirit.Types.Ceramic',
        earth: 'SR6.Spirit.Types.Earth',
        energy: 'SR6.Spirit.Types.Energy',
        fire: 'SR6.Spirit.Types.Fire',
        guardian: 'SR6.Spirit.Types.Guardian',
        guidance: 'SR6.Spirit.Types.Guidance',
        man: 'SR6.Spirit.Types.Man',
        metal: 'SR6.Spirit.Types.Metal',
        plant: 'SR6.Spirit.Types.Plant',
        ship: 'SR6.Spirit.Types.Ship',
        task: 'SR6.Spirit.Types.Task',
        train: 'SR6.Spirit.Types.Train',
        water: 'SR6.Spirit.Types.Water',

        // toxic types
        toxic_air: 'SR6.Spirit.Types.ToxicAir',
        toxic_beasts: 'SR6.Spirit.Types.ToxicBeasts',
        toxic_earth: 'SR6.Spirit.Types.ToxicEarth',
        toxic_fire: 'SR6.Spirit.Types.ToxicFire',
        toxic_man: 'SR6.Spirit.Types.ToxicMan',
        toxic_water: 'SR6.Spirit.Types.ToxicWater',

        // blood types
        blood: 'SR6.Spirit.Types.Blood',

        // shadow types
        muse: 'SR6.Spirit.Types.Muse',
        nightmare: 'SR6.Spirit.Types.Nightmare',
        shade: 'SR6.Spirit.Types.Shade',
        succubus: 'SR6.Spirit.Types.Succubus',
        wraith: 'SR6.Spirit.Types.Wraith',

        // shedim types
        shedim: 'SR6.Spirit.Types.Shedim',
        master_shedim: 'SR6.Spirit.Types.MasterShedim',

        // insect types
        caretaker: 'SR6.Spirit.Types.Caretaker',
        nymph: 'SR6.Spirit.Types.Nymph',
        scout: 'SR6.Spirit.Types.Scout',
        soldier: 'SR6.Spirit.Types.Soldier',
        worker: 'SR6.Spirit.Types.Worker',
        queen: 'SR6.Spirit.Types.Queen',
    },

    critterPower: {
        categories: {
          mundane: 'SR6.CritterPower.Categories.Mundane',
          paranormal: 'SR6.CritterPower.Categories.Paranormal',
          free_spirit: 'SR6.CritterPower.Categories.FreeSpirit',
          emergent: 'SR6.CritterPower.Categories.Emergent',
          shapeshifter: 'SR6.CritterPower.Categories.Shapeshifter',
          drake: 'SR6.CritterPower.Categories.Drake',
          echoes: 'SR6.CritterPower.Categories.Echoes',
          weakness: 'SR6.CritterPower.Categories.Weakness',
          paranormal_infected: 'SR6.CritterPower.Categories.ParanormalInfected',
        },
        types: {
            mana: 'SR6.CritterPower.Types.Mana',
            physical: 'SR6.CritterPower.Types.Physical',
        },
        ranges: {
            los: 'SR6.CritterPower.Ranges.LineOfSight',
            self: 'SR6.CritterPower.Ranges.Self',
            touch: 'SR6.CritterPower.Ranges.Touch',
            los_a: 'SR6.CritterPower.Ranges.LineOfSightArea',
            special: 'SR6.CritterPower.Ranges.Special',
        },
        durations: {
            always: 'SR6.CritterPower.Durations.Always',
            instant: 'SR6.CritterPower.Durations.Instant',
            sustained: 'SR6.CritterPower.Durations.Sustained',
            permanent: 'SR6.CritterPower.Durations.Permanent',
            special: 'SR6.CritterPower.Durations.Special',
        },
    },

    spriteTypes: {
        courier: 'SR6.Sprite.Types.Courier',
        crack: 'SR6.Sprite.Types.Crack',
        data: 'SR6.Sprite.Types.Data',
        fault: 'SR6.Sprite.Types.Fault',
        machine: 'SR6.Sprite.Types.Machine',
    },

    vehicle: {
        types: {
            air: 'SR6.Vehicle.Types.Air',
            aerospace: 'SR6.Vehicle.Types.Aerospace',
            ground: 'SR6.Vehicle.Types.Ground',
            water: 'SR6.Vehicle.Types.Water',
            walker: 'SR6.Vehicle.Types.Walker',
            exotic: 'SR6.Vehicle.Types.Exotic',
        },
        stats: {
            handling: 'SR6.Vehicle.Stats.Handling',
            off_road_handling: 'SR6.Vehicle.Stats.OffRoadHandling',
            speed: 'SR6.Vehicle.Stats.Speed',
            off_road_speed: 'SR6.Vehicle.Stats.OffRoadSpeed',
            acceleration: 'SR6.Vehicle.Stats.Acceleration',
            pilot: 'SR6.Vehicle.Stats.Pilot',
            sensor: 'SR6.Vehicle.Stats.Sensor',
        },
        control_modes: {
            manual: 'SR6.Vehicle.ControlModes.Manual',
            remote: 'SR6.Vehicle.ControlModes.Remote',
            rigger: 'SR6.Vehicle.ControlModes.Rigger',
            autopilot: 'SR6.Vehicle.ControlModes.Autopilot',
        },
        environments: {
            speed: 'SR6.Vehicle.Environments.Speed',
            handling: 'SR6.Vehicle.Environments.Handling',
        },
    },

    character: {
        types: {
            human: 'SR6.Character.Types.Human',
            elf: 'SR6.Character.Types.Elf',
            ork: 'SR6.Character.Types.Ork',
            dwarf: 'SR6.Character.Types.Dwarf',
            troll: 'SR6.Character.Types.Troll',
        },
    },
};
