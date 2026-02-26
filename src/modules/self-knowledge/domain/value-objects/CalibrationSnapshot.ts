// src/modules/self-knowledge/domain/value-objects/CalibrationSnapshot.ts
import { ValueObject } from "../../../../shared/core/ValueObject";
import { Result } from "../../../../shared/core/Result";

interface CalibrationSnapshotProps {
  predictedConfidence: number; // 1-5 scale
  actualSignalRating: number;   // 1-5 scale (derived from Focus Block signals)
  timestamp: Date;
}

export class CalibrationSnapshot extends ValueObject<CalibrationSnapshotProps> {
  public static create(props: CalibrationSnapshotProps): Result<CalibrationSnapshot> {
    if (props.predictedConfidence < 1 || props.predictedConfidence > 5) {
      return Result.fail("Confidence must be between 1 and 5");
    }
    return Result.ok(new CalibrationSnapshot(props));
  }

  /**
   * Calculates the 'Gap'. 
   * A lower delta means higher awareness (calibration).
   */
  get calibrationDelta(): number {
    return Math.abs(this.props.predictedConfidence - this.props.actualSignalRating);
  }
}