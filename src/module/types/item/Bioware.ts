/// <reference path="../Shadowrun.ts" />
declare namespace Shadowrun {
    export type Bioware = SR6ItemData<BiowareData> & {
        type: 'bioware';
    };

    export type BiowareData = BiowarePartData & DescriptionPartData & TechnologyPartData & ActionPartData & ArmorPartData;

    export type BiowarePartData = {
        essence: number;
        capacity: number;
        grade: string;
    };
}
