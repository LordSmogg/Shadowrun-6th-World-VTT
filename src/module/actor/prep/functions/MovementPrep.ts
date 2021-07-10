import SR6ActorData = Shadowrun.SR6ActorData;
import MovementActorData = Shadowrun.MovementActorData;

export class MovementPrep {
    static prepareMovement(data: SR6ActorData & MovementActorData) {
        const { attributes, modifiers } = data;
        const movement = data.movement;
        // default movement: WALK = AGI * 2, RUN = AGI * 4
        movement.walk.value = attributes.agility.value * (2 + Number(modifiers['walk']));
        movement.run.value = attributes.agility.value * (4 + Number(modifiers['run']));
    }
}
