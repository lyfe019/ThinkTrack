import { ValueObject } from "../../../../shared/core/ValueObject";
import { Result } from "../../../../shared/core/Result";

export enum StateLabel {
  CALM = 'CALM',
  STUCK = 'STUCK',
  LOST = 'LOST',           // Needed for Circuit Breaker
  OVERLOADED = 'OVERLOADED',
  DRAINED = 'DRAINED'
}

interface RegulationStateProps {
  label: StateLabel;
  message: string;
}

export class RegulationState extends ValueObject<RegulationStateProps> {
  get label(): StateLabel { return this.props.label; }
  get text(): string { return this.props.message; }

  private constructor(props: RegulationStateProps) {
    super(props);
  }

  public static create(label: StateLabel): RegulationState {
    const messages: Record<StateLabel, string> = {
      [StateLabel.CALM]: "You're in a steady flow.",
      [StateLabel.STUCK]: "Being 'Stuck' is a natural part of deep learning. Your brain is searching for a connection.",
      [StateLabel.LOST]: "Circuit breaker activated. It's time to step back and breathe.",
      [StateLabel.OVERLOADED]: "Cognitive load is high. Consider simplifying the current task.",
      [StateLabel.DRAINED]: "Energy is low. A short break might be more productive than pushing through."
    };

    return new RegulationState({
      label,
      message: messages[label]
    });
  }
}