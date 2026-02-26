import { ValueObject } from "../../../../shared/core/ValueObject";
import { Result } from "../../../../shared/core/Result";

export enum ObjectiveSignalRating {
  LOW_INTERACTION = "LOW_INTERACTION",
  STABLE = "STABLE",
  HIGH_FRICTION = "HIGH_FRICTION"
}

interface CalibrationSnapshotProps {
  confidenceScore: number; // 1-5
  objectiveRating: ObjectiveSignalRating;
  gapValue: number;
  insightKey: string;
}

export class CalibrationSnapshot extends ValueObject<CalibrationSnapshotProps> {
  private constructor(props: CalibrationSnapshotProps) {
    super(props);
  }

  public static create(confidence: number, rating: ObjectiveSignalRating): Result<CalibrationSnapshot> {
    if (confidence < 1 || confidence > 5) {
      return Result.fail<CalibrationSnapshot>("Confidence must be between 1 and 5");
    }

    // Logic: Calculate GapValue Δ
    // High friction (3) vs High confidence (5) = High Gap
    const ratingWeight = { [ObjectiveSignalRating.LOW_INTERACTION]: 1, [ObjectiveSignalRating.STABLE]: 2, [ObjectiveSignalRating.HIGH_FRICTION]: 5 };
    const gapValue = Math.abs(confidence - ratingWeight[rating]);

    // Neutral Template Logic
    let insightKey = "STABLE_ALIGNMENT";
    if (rating === ObjectiveSignalRating.HIGH_FRICTION && confidence >= 4) {
      insightKey = "ILLUSION_OF_COMPETENCE_RISK";
    } else if (rating === ObjectiveSignalRating.LOW_INTERACTION && confidence <= 2) {
      insightKey = "POTENTIAL_UNDERESTIMATION";
    }

    return Result.ok<CalibrationSnapshot>(new CalibrationSnapshot({
      confidenceScore: confidence,
      objectiveRating: rating,
      gapValue,
      insightKey
    }));
  }
}