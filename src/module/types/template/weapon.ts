declare namespace Shadowrun {
    export type RangesTemplateData = {
		close: RangeTemplateData,
        near: RangeTemplateData,
        medium: RangeTemplateData,
        far: RangeTemplateData,
        extreme: RangeTemplateData,
    }

    export type RangeTemplateData =
        LabelField &
        ModifierField & {
        distance: number
    }
}