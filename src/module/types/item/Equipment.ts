declare namespace Shadowrun {
    export type Equipment = SR6ItemData<EquipmentData> & {
        type: 'equipment';
    };

    export type EquipmentData = DescriptionPartData & TechnologyPartData;
}
