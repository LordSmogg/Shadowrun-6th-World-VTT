declare namespace Shadowrun {
    export type Technology = SR6ItemData<TechnologyPartData>;
    export type TechnologyPartData = {
        technology: TechnologyData
    };
    export type TechnologyData = {
        rating: NumberOrEmpty;
        availability: string;
        quantity: NumberOrEmpty;
        cost: NumberOrEmpty;
        equipped: boolean;
        conceal: ModifiableValue;
        condition_monitor?: ConditionData;
        wireless: boolean;
    };
}
