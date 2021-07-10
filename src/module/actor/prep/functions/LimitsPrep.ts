import SR6ActorData = Shadowrun.SR6ActorData;
import { PartsList } from '../../../parts/PartsList';
import { Helpers } from '../../../helpers';
import {SR6} from "../../../config";

export class LimitsPrep {
    static prepareLimits(data: SR6ActorData) {
        const { limits, modifiers } = data;

        // SETUP LIMITS
        limits.physical.mod = PartsList.AddUniquePart(limits.physical.mod, 'SR6.Bonus', Number(modifiers['physical_limit']));
        limits.mental.mod = PartsList.AddUniquePart(limits.mental.mod, 'SR6.Bonus', Number(modifiers['mental_limit']));
        limits.social.mod = PartsList.AddUniquePart(limits.social.mod, "SR6.Bonus", Number(modifiers['social_limit']));

        // limit labels
        for (let [limitKey, limitValue] of Object.entries(limits)) {
            Helpers.calcTotal(limitValue);
            limitValue.label = SR6.limits[limitKey];
        }
    }

    static prepareLimitBaseFromAttributes(data: SR6ActorData) {

        const { limits, attributes } = data;

        limits.physical.base = Math.ceil((2 * attributes.strength.value + attributes.body.value + attributes.reaction.value) / 3);
        limits.mental.base = Math.ceil((2 * attributes.logic.value + attributes.intuition.value + attributes.willpower.value) / 3);
        limits.social.base = Math.ceil((2 * attributes.charisma.value + attributes.willpower.value + attributes.essence.value) / 3);

    }
}
