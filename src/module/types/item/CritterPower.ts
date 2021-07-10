declare namespace Shadowrun {
    export type CritterPower = SR6ItemData<CritterPowerData> & {
        type: 'critter_power';
    };
    export type CritterPowerCategory = 'mundane' | 'paranormal' | 'weakness' | 'emergent' | 'drake' | 'shapeshifter' | 'free_spirit' | 'paranormal_infected' | 'echoes' | '';
    export type CritterPowerData = CritterPowerPartData & ActionPartData & DescriptionPartData & ArmorPartData;

    export type CritterPowerPartData = {
        category: keyof typeof SR6CONFIG.critterPower.categories;
        powerType: keyof typeof SR6CONFIG.critterPower.types;
        range: CritterPowerRange;
        duration: keyof typeof SR6CONFIG.critterPower.durations;
        karma: number;
    };

    export type CritterPowerRange = keyof typeof SR6CONFIG.critterPower.ranges;
}
