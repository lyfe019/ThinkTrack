import { Entity } from "../../../../shared/core/Entity";
import { UniqueEntityID } from "../../../../shared/core/UniqueEntityID"; 
import { Result } from "../../../../shared/core/Result";

export enum IntentOutcome {
  PLANNED = 'PLANNED',
  ACHIEVED = 'ACHIEVED',
  PARTIAL = 'PARTIAL',
  CARRIED_FORWARD = 'CARRIED_FORWARD'
}

interface IntentProps {
  description: string;
  outcome: IntentOutcome;
}

export class MicroIntent extends Entity<IntentProps> {
  private constructor(props: IntentProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(description: string, id?: UniqueEntityID): Result<MicroIntent> {
    if (!description || description.trim().length === 0) {
      return Result.fail<MicroIntent>("Micro-Intent cannot be empty.");
    }
    
    return Result.ok<MicroIntent>(
      new MicroIntent({ 
        description, 
        outcome: IntentOutcome.PLANNED 
      }, id)
    );
  }

  public complete(): void {
    this.props.outcome = IntentOutcome.ACHIEVED;
  }

  public markPartial(): void {
    this.props.outcome = IntentOutcome.PARTIAL;
  }

  // --- Add these Getters ---

  get description(): string {
    return this.props.description;
  }

  get outcome(): IntentOutcome {
    return this.props.outcome;
  }
}