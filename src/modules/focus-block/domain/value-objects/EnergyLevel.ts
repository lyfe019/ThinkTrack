import { ValueObject } from "../../../../shared/core/ValueObject";
import { Result } from "../../../../shared/core/Result";

export enum EnergyLevelValue {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export class EnergyLevel extends ValueObject<{ value: EnergyLevelValue }> {
  get value(): EnergyLevelValue {
    return this.props.value;
  }

  private constructor(props: { value: EnergyLevelValue }) {
    super(props);
  }

  public static create(value: string): Result<EnergyLevel> {
    // Convert input to UPPERCASE to match the Enum
    const normalizedValue = value ? value.toUpperCase() : "";

    if (!Object.values(EnergyLevelValue).includes(normalizedValue as EnergyLevelValue)) {
      return Result.fail<EnergyLevel>("Invalid energy level.");
    }
    
    return Result.ok<EnergyLevel>(new EnergyLevel({ value: normalizedValue as EnergyLevelValue }));
  }
}