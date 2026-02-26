// src/modules/self-knowledge/domain/entities/LearningProfile.ts
import { Entity } from "../../../../shared/core/Entity";
import { UniqueEntityID } from "../../../../shared/core/UniqueEntityID";
import { Result } from "../../../../shared/core/Result";
import { Insight } from "./Insight";
import { PersonalizedProfile } from "../value-objects/PersonalizedProfile";
import { AwarenessTrend } from "../value-objects/AwarenessTrend";
import { Guard } from "../../../../shared/core/Guard";

interface LearningProfileProps {
  userId: UniqueEntityID;
  insights: Insight[];
  goldenRules: PersonalizedProfile;
  awarenessHistory: AwarenessTrend[];
  lastReviewDate: Date;
}

export class LearningProfile extends Entity<LearningProfileProps> {
  get userId(): UniqueEntityID { return this.props.userId; }
  get insights(): Insight[] { return this.props.insights; }
  get goldenRules(): PersonalizedProfile { return this.props.goldenRules; }
  get awarenessHistory(): AwarenessTrend[] { return this.props.awarenessHistory; }

  private constructor(props: LearningProfileProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(props: LearningProfileProps, id?: UniqueEntityID): Result<LearningProfile> {
    const guard = Guard.againstNullOrUndefined(props.userId, 'userId');
    if (guard.isFailure) return Result.fail<LearningProfile>(guard.error!);

    const profile = new LearningProfile({
      ...props,
      insights: props.insights || [],
      awarenessHistory: props.awarenessHistory || [],
      lastReviewDate: props.lastReviewDate || new Date()
    }, id);

    return Result.ok<LearningProfile>(profile);
  }

  /**
   * Business Rule 5: Profile Evolution Rule
   * Flags the profile if it hasn't been re-evaluated in 30 days.
   */
  public isReviewRequired(): boolean {
    const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
    const timeSinceLastReview = new Date().getTime() - this.props.lastReviewDate.getTime();
    return timeSinceLastReview > thirtyDaysInMs;
  }

  /**
   * Process 1: Adds a new synthesized strength insight.
   */
  public addInsight(insight: Insight): void {
    this.props.insights.push(insight);
  }

  /**
   * Process 2: Updates the "Golden Rules" based on user success patterns.
   */
  public updateGoldenRules(newRules: PersonalizedProfile): void {
    this.props.goldenRules = newRules;
    this.props.lastReviewDate = new Date();
  }

  /**
   * Process 3: Records a new awareness trend to track growth over time.
   * Limits history to 12 entries to maintain aggregate performance.
   */
  public recordAwarenessTrend(trend: AwarenessTrend): void {
    this.props.awarenessHistory.push(trend);
    
    if (this.props.awarenessHistory.length > 12) {
      this.props.awarenessHistory.shift();
    }
  }
}