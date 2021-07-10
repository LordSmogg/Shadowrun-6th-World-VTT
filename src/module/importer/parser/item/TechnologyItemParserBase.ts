import SR6ItemType = Shadowrun.SR6ItemType;
import { ItemParserBase } from './ItemParserBase';
import { ImportHelper } from '../../helper/ImportHelper';
import Technology = Shadowrun.Technology;

export abstract class TechnologyItemParserBase<TResult extends Technology & SR6ItemType> extends ItemParserBase<TResult> {
    Parse(jsonData: object, data: TResult, jsonTranslation?: object): TResult {
        data = super.Parse(jsonData, data, jsonTranslation);

        data.data.technology.availability = ImportHelper.StringValue(jsonData, 'avail', '0');
        data.data.technology.cost = ImportHelper.IntValue(jsonData, 'cost', 0);
        data.data.technology.rating = ImportHelper.IntValue(jsonData, 'rating', 0);

        return data;
    }
}
