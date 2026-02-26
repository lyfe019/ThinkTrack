import { ValueObject } from "../../../../shared/core/ValueObject";
import { Result } from "../../../../shared/core/Result";

export class FocusDuration extends ValueObject<{ minutes: number }> {
  get minutes(): number {
    return this.props.minutes;
  }

  private constructor(props: { minutes: number }) {
    super(props);
  }

  public static create(minutes: number): Result<FocusDuration> {
    if (minutes <= 0) {
      return Result.fail<FocusDuration>("Duration must be greater than zero.");
    }
    return Result.ok<FocusDuration>(new FocusDuration({ minutes }));
  }
}