import SR6ActorData = Shadowrun.SR6ActorData;
import PhysicalTrackActorData = Shadowrun.PhysicalTrackActorData;
import StunTrackActorData = Shadowrun.StunTrackActorData;
import TwoTrackActorData = Shadowrun.TwoTrackActorData;
import {SR6} from "../../../config";

export class ConditionMonitorsPrep {
    static prepareStun(data: SR6ActorData & StunTrackActorData) {
        const { track, attributes, modifiers } = data;

        track.stun.base = 8 + Math.ceil(attributes.willpower.value / 2);
        track.stun.max = track.stun.base + Number(modifiers['stun_track']);
        track.stun.label = SR6.damageTypes.stun;
        track.stun.disabled = false;
    }

    static preparePhysical(data: SR6ActorData & PhysicalTrackActorData) {
        const { track, attributes, modifiers } = data;

        track.physical.base = 8 + Math.ceil(attributes.body.value / 2);
        track.physical.max = track.physical.base + Number(modifiers['physical_track']);
        track.physical.overflow.max = attributes.body.value;
        track.physical.label = SR6.damageTypes.physical;
        track.physical.disabled = false;
    }

    static prepareGrunt(data: SR6ActorData & TwoTrackActorData) {
        // Grunts use only one monitor, use physical to get overflow functionality.
        ConditionMonitorsPrep.prepareStun(data);

        const { track, attributes, modifiers } = data;
        // Overwrite stun damage to avoid invisible damage modifiers.
        track.stun.value = 0;
        track.stun.disabled = true;

        // Grunts use either their WIL or BOD as their monitors attribute.
        const attribute = attributes.willpower.value > attributes.body.value ?
            attributes.willpower:
            attributes.body;

        track.physical.base = 8 + Math.ceil(attribute.value / 2);
        track.physical.max = track.physical.base + Number(modifiers['physical_track']);
        track.physical.overflow.max = attributes.body.value;
        track.physical.label = "SR6.ConditionMonitor";
        track.physical.disabled = false;
    }
}
