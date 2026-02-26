// src/modules/self-knowledge/domain/value-objects/ReframedInsight.ts
import { ValueObject } from "../../../../shared/core/ValueObject";
import { Result } from "../../../../shared/core/Result";
import { Guard } from "../../../../shared/core/Guard";

export enum InsightTone {
  ENCOURAGING = "ENCOURAGING",
  OBSERVATIONAL = "OBSERVATIONAL",
  EMPOWERING = "EMPOWERING"
}

export enum InsightCategory {
  STAMINA = "STAMINA",
  STRATEGY_USE = "STRATEGY_USE",
  CALIBRATION = "CALIBRATION"
}

interface ReframedInsightProps {
  content: string;
  tone: InsightTone;
  category: InsightCategory;
}

export class ReframedInsight extends ValueObject<ReframedInsightProps> {
  private static readonly BLACKLIST = ["failure", "inconsistent", "short-attention", "poor", "deficit", "lazy"];

  public static create(props: ReframedInsightProps): Result<ReframedInsight> {
    const guard = Guard.againstNullOrUndefined(props.content, 'content');
    if (guard.isFailure) return Result.fail<ReframedInsight>(guard.error!);

    const lowerContent = props.content.toLowerCase();
    if (this.BLACKLIST.some(word => lowerContent.includes(word))) {
      return Result.fail<ReframedInsight>("Strength-First Rule: Insight contains forbidden deficit-based language.");
    }
    return Result.ok<ReframedInsight>(new ReframedInsight(props));
  }
  get content(): string { return this.props.content; }
}