// src/modules/self-knowledge/domain/value-objects/NonPunitiveDashboardData.ts

import { ValueObject } from "../../../../shared/core/ValueObject";
import { Result } from "../../../../shared/core/Result";

interface DashboardProps {
  stateHeatmap: any;      // Visualizes focus states
  recoveryRate: string;   // Visualizes how quickly user resets
  insightSummary: string; // The "Strength" highlights
}

export class NonPunitiveDashboardData extends ValueObject<DashboardProps> {
  // Business Rule 4: No-Shame Visualization Guardrail
  private static readonly FORBIDDEN_METRICS = [
    "STREAKS", 
    "LEADERBOARDS", 
    "TIME_LOST", 
    "MISSED_GOALS",
    "FAILURES"
  ];

  public static create(props: DashboardProps, rawInputData: any): Result<NonPunitiveDashboardData> {
    const inputKeys = Object.keys(rawInputData).map(k => k.toUpperCase());

    // If any forbidden metric is found in the raw data, block the dashboard creation
    const containsPunitiveData = this.FORBIDDEN_METRICS.some(forbidden => 
      inputKeys.some(key => key.includes(forbidden))
    );

    if (containsPunitiveData) {
      return Result.fail<NonPunitiveDashboardData>(
        "No-Shame Rule: Dashboard data cannot contain punitive or deficit-based metrics."
      );
    }

    return Result.ok<NonPunitiveDashboardData>(new NonPunitiveDashboardData(props));
  }

  get stateHeatmap(): any { return this.props.stateHeatmap; }
  get recoveryRate(): string { return this.props.recoveryRate; }
}