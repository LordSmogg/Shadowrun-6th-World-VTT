declare namespace Shadowrun {
    export type Program = SR6ItemData<ProgramData> & {
        type: 'program';
    };

    export type ProgramData = ProgramPartData & DescriptionPartData & TechnologyPartData;

    export type ProgramPartData = {
        type: ProgramTypes;
    };

    export type ProgramTypes = 'common_program' | 'hacking_program' | '';
}
