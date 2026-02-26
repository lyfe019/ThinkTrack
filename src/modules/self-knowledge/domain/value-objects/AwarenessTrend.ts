// src/modules/self-knowledge/domain/value-objects/AwarenessTrend.ts
import { ValueObject } from "../../../../shared/core/ValueObject";

export enum TrendDirection {
  IMPROVING = "IMPROVING",
  STABLE = "STABLE",
  FLUCTUATING = "FLUCTUATING"
}

interface AwarenessTrendProps {
  accuracyScore: number; // 0-1 decimal representing calibration accuracy
  trendDirection: TrendDirection;
  startDate: Date;
  endDate: Date;
}

export class AwarenessTrend extends ValueObject<AwarenessTrendProps> {
  public static create(props: AwarenessTrendProps): AwarenessTrend {
    return new AwarenessTrend(props);
  }

  get accuracyScore(): number { return this.props.accuracyScore; }
}