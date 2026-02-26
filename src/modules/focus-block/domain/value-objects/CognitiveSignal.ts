import { ValueObject } from "../../../../shared/core/ValueObject";
import { Result } from "../../../../shared/core/Result";

export enum SignalType {
  TAB_SWITCH = 'TAB_SWITCH',
  LONG_PAUSE = 'LONG_PAUSE',
  SCROLL_BURST = 'SCROLL_BURST',
  IDLE = 'IDLE'
}

interface SignalProps {
  type: SignalType;
  timestamp: Date;
  metadata?: any;
}

export class CognitiveSignal extends ValueObject<SignalProps> {
  private constructor(props: SignalProps) {
    super(props);
  }

  public static create(type: string, metadata?: any): Result<CognitiveSignal> {
    const normalized = type.toUpperCase() as SignalType;
    if (!Object.values(SignalType).includes(normalized)) {
      return Result.fail("Invalid signal type.");
    }

    return Result.ok(new CognitiveSignal({
      type: normalized,
      timestamp: new Date(),
      metadata
    }));
  }
}