import { Entity } from "../../../../shared/core/Entity";
import { UniqueEntityID } from "../../../../shared/core/UniqueEntityID";
import { Result } from "../../../../shared/core/Result";
import { IdentityTag } from "../value-objects/IdentityTag";
import { ActiveConfiguration } from "../value-objects/ActiveConfiguration";
import { UIComplexity } from "../value-objects/UIComplexity";
import { PrivacyLevel } from "../value-objects/PrivacyLevel";
import { VisualAtmosphere } from "../value-objects/VisualAtmosphere";

interface UserPreferenceProps {
  userId: UniqueEntityID;
  tags: IdentityTag[];
  activeConfig: ActiveConfiguration;
  baseConfig: ActiveConfiguration; 
  privacyLevel: PrivacyLevel;
  lastHeavyLoadDate?: Date;
  overrideHistory: Array<{ setting: string, value: any }>; // Process 4: Tracking history
}

/**
 * UserPreference Aggregate Root
 * Orchestrates identity-driven UI adjustments and ethical guardrails.
 */
export class UserPreference extends Entity<UserPreferenceProps> {
  
  get userId(): UniqueEntityID { return this.props.userId; }
  get activeConfig(): ActiveConfiguration { return this.props.activeConfig; }
  get tags(): IdentityTag[] { return this.props.tags; }
  get privacyLevel(): PrivacyLevel { return this.props.privacyLevel; }

  private constructor(props: UserPreferenceProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(props: UserPreferenceProps, id?: UniqueEntityID): Result<UserPreference> {
    if (!props.userId) return Result.fail<UserPreference>("UserId is required");
    
    const pref = new UserPreference({
      ...props,
      tags: props.tags || [],
      privacyLevel: props.privacyLevel || PrivacyLevel.PRIVATE,
      overrideHistory: props.overrideHistory || []
    }, id);

    return Result.ok<UserPreference>(pref);
  }

  /**
   * Process 1: Profile-Driven Initialization
   * Rule 1: Maps identity markers to sensible starting points.
   */
  public applyHeuristicTemplate(tag: IdentityTag): void {
    let duration = 25;
    let frequency = 30;
    let complexity = UIComplexity.STANDARD;
    let atmosphere = VisualAtmosphere.NEUTRAL;

    if (tag === IdentityTag.ADHD) {
      duration = 10;
      frequency = 15;
    } else if (tag === IdentityTag.AUTISTIC) {
      duration = 45; 
      complexity = UIComplexity.REDUCED_SENSORY;
      atmosphere = VisualAtmosphere.LOW_SENSORY_BLUE;
    }

    const newConfig = ActiveConfiguration.create({
      defaultFocusBlockDuration: duration,
      promptFrequency: frequency,
      uiComplexity: complexity,
      atmosphere: atmosphere,
      notificationsMuted: false
    });

    this.props.activeConfig = newConfig;
    this.props.baseConfig = newConfig;
  }

  /**
   * Process 2 & 3: Sensory & Cognitive UI Orchestration
   * Rule 2: Force minimalist UI during heavy load with a 3-minute cooldown.
   */
  public applySensoryGuardrail(isHeavyLoad: boolean): void {
    if (isHeavyLoad) {
      this.props.activeConfig = ActiveConfiguration.create({
        ...this.props.activeConfig.props,
        uiComplexity: UIComplexity.MINIMALIST,
        atmosphere: VisualAtmosphere.LOW_SENSORY_BLUE,
        notificationsMuted: true
      });
      this.props.lastHeavyLoadDate = new Date();
    } else {
      const COOLDOWN_MS = 3 * 60 * 1000;
      const now = Date.now();
      const lastHeavy = this.props.lastHeavyLoadDate?.getTime() || 0;

      if (now - lastHeavy > COOLDOWN_MS) {
        this.props.activeConfig = this.props.baseConfig;
      }
    }
  }

  /**
   * Process 3: Manual Atmosphere Override
   */
  public manuallySetAtmosphere(newAtmosphere: VisualAtmosphere): void {
    this.props.activeConfig = ActiveConfiguration.create({
      ...this.props.activeConfig.props,
      atmosphere: newAtmosphere
    });
    this.props.baseConfig = this.props.activeConfig;
  }

  /**
   * Process 4: Preference Evolution (80% Consistency Rule)
   */
  public recordOverride(setting: string, value: any): void {
    this.props.overrideHistory.push({ setting, value });
    if (this.props.overrideHistory.length > 10) {
      this.props.overrideHistory.shift();
    }
  }

  public getEvolutionSuggestion(setting: string): any | null {
    if (this.props.overrideHistory.length < 10) return null;

    const relevantOverrides = this.props.overrideHistory.filter(h => h.setting === setting);
    const valueCounts: Record<string, number> = {};

    relevantOverrides.forEach(o => {
      const valStr = JSON.stringify(o.value);
      valueCounts[valStr] = (valueCounts[valStr] || 0) + 1;
    });

    for (const [val, count] of Object.entries(valueCounts)) {
      if (count >= 8) return JSON.parse(val);
    }
    return null;
  }

  public updateTags(newTags: IdentityTag[]): void {
    this.props.tags = newTags;
  }

  /**
   * Rule 5: Forbidden Metric Invariant
   */
  public requestMetric(metricType: string): void {
    const forbidden = ["STREAK", "RANKING", "LEADERBOARD", "COMPETITION", "TIME_LOST"];
    if (forbidden.some(f => metricType.toUpperCase().includes(f))) {
      throw new Error(`AccessDenied: ThinkTrack forbids punitive metrics like ${metricType}.`);
    }
  }
}