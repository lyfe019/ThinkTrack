import { ValueObject } from "../../../../shared/core/ValueObject";
import { Result } from "../../../../shared/core/Result";

export enum LoadLevel {
  LIGHT = 'LIGHT',
  MEDIUM = 'MEDIUM',
  HEAVY = 'HEAVY'
}

export enum LoadVelocity {
  RISING = 'RISING',
  STABLE = 'STABLE',
  FALLING = 'FALLING'
}

interface CognitiveLoadProps {
  level: LoadLevel;
  velocity: LoadVelocity;
  confidenceScore: number; // 0.0 to 1.0
}

export class CognitiveLoad extends ValueObject<CognitiveLoadProps> {
  // Getters are essential for mapping to JSON in the controller
  get level(): LoadLevel { return this.props.level; }
  get velocity(): LoadVelocity { return this.props.velocity; }
  get confidence(): number { return this.props.confidenceScore; }

  private constructor(props: CognitiveLoadProps) {
    super(props);
  }

  public static create(props: CognitiveLoadProps): Result<CognitiveLoad> {
    if (props.confidenceScore < 0 || props.confidenceScore > 1) {
      return Result.fail("Confidence score must be between 0 and 1");
    }
    return Result.ok<CognitiveLoad>(new CognitiveLoad(props));
  }
}