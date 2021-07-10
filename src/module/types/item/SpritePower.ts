/// <reference path="../Shadowrun.ts" />
declare namespace Shadowrun {
    export type SpritePower = SR6ItemData<SpritePowerData> & {
        type: 'sprite_power';
    };
    export type SpritePowerData = ActionPartData & DescriptionPartData;
}
