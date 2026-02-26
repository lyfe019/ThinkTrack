import { ValueObject } from "../../../../shared/core/ValueObject";
import { Result } from "../../../../shared/core/Result";

export enum MoodValue {
  ACCOMPLISHED = 'ACCOMPLISHED',
  TIRED = 'TIRED',
  STILL_CURIOUS = 'STILL_CURIOUS',
  READY_TO_STOP = 'READY_TO_STOP'
}

interface ExitMoodProps {
  value: MoodValue;
}

export class ExitMood extends ValueObject<ExitMoodProps> {
  get value(): MoodValue {
    return this.props.value;
  }

  private constructor(props: ExitMoodProps) {
    super(props);
  }

  public static create(value: string): Result<ExitMood> {
    if (!value) {
      return Result.fail<ExitMood>("Mood value is required.");
    }

    const normalized = value.toUpperCase().trim();
    
    if (!Object.values(MoodValue).includes(normalized as MoodValue)) {
      return Result.fail<ExitMood>(`Invalid exit mood: ${value}`);
    }

    return Result.ok<ExitMood>(new ExitMood({ value: normalized as MoodValue }));
  }
}