import {shadowrunRulesModifiers} from "./sr6.Modifiers.spec";
import {shadowrunSR6Item} from "./sr6.SR6Item.spec";

export const quenchRegister = quench => {
    quench.registerBatch("shadowrun6e.rules.modifiers", shadowrunRulesModifiers);
    quench.registerBatch("shadowrun6e.entities.items", shadowrunSR6Item);
};
