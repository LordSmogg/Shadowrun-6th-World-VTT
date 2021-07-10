import SR6ActorType = Shadowrun.SR6ActorType;
import { SR6ItemDataWrapper } from '../../item/SR6ItemDataWrapper';
import SR6ActorData = Shadowrun.SR6ActorData;

export abstract class BaseActorPrep<ActorType extends SR6ActorType, DataType extends SR6ActorData> {
    data: DataType;
    items: SR6ItemDataWrapper[];

    constructor(data: ActorType) {
        this.data = data.data;
        this.items = data.items.map((item) => new SR6ItemDataWrapper(item.data));
    }

    // override with the correct order and functions to prepare the actor
    abstract prepare(): void;
}
