// src/modules/self-knowledge/domain/value-objects/PersonalizedProfile.ts
import { ValueObject } from "../../../../shared/core/ValueObject";
import { UniqueEntityID } from "../../../../shared/core/UniqueEntityID";

interface PersonalizedProfileProps {
  optimalBlockDuration: string; // e.g., "15 minutes"
  topRecoveryStrategies: UniqueEntityID[]; // IDs from Metacognitive Strategy context
  idealEnergyEntry: string; // e.g., "Morning - High focus"
}

export class PersonalizedProfile extends ValueObject<PersonalizedProfileProps> {
  public static create(props: PersonalizedProfileProps): PersonalizedProfile {
    return new PersonalizedProfile(props);
  }

  get optimalBlockDuration(): string { return this.props.optimalBlockDuration; }
}