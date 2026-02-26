import { ValueObject } from "../../../../shared/core/ValueObject";
import { Result } from "../../../../shared/core/Result";

export enum AdjustmentDirection { SWELL = 'SWELL', SHRINK = 'SHRINK' }

interface TimeAdjustmentProps {
  direction: AdjustmentDirection;
  minutes: number;
  timestamp: Date;
}

export class TimeAdjustment extends ValueObject<TimeAdjustmentProps> {
  public static create(minutes: number): Result<TimeAdjustment> {
    const direction = minutes > 0 ? AdjustmentDirection.SWELL : AdjustmentDirection.SHRINK;
    return Result.ok(new TimeAdjustment({
      direction,
      minutes: Math.abs(minutes),
      timestamp: new Date()
    }));
  }
}