import SR6ActorData = Shadowrun.SR6ActorData;
import TwoTrackActorData = Shadowrun.TwoTrackActorData;
import WoundsActorData = Shadowrun.WoundsActorData;

export class WoundsPrep {
    static prepareWounds(data: SR6ActorData & TwoTrackActorData & WoundsActorData) {
        const { modifiers, track } = data;
        const count = 3 + Number(modifiers['wound_tolerance']);
        const stunWounds = track.stun.disabled ? 0 : Math.floor(track.stun.value / count);
        const physicalWounds = track.physical.disabled ? 0 : Math.floor(track.physical.value / count);

        track.stun.wounds = stunWounds;
        track.physical.wounds = physicalWounds;

        data.wounds = {
            value: stunWounds + physicalWounds,
        };
    }
}
