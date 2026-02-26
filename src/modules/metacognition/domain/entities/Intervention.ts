import { Entity } from "../../../../shared/core/Entity";
import { UniqueEntityID } from "../../../../shared/core/UniqueEntityID";
import { Result } from "../../../../shared/core/Result";
import { Guard } from "../../../../shared/core/Guard";
import { DomainEvents } from "../../../../shared/domain/events/DomainEvents";

// Events
import { StrategySelected } from "../events/StrategySelected";
import { CalibrationCompleted } from "../events/CalibrationCompleted";

// Domain Objects
import { InterventionTriggerType, StrategyImpact } from "./InterventionEnums";
import { CalibrationSnapshot } from "../value-objects/CalibrationSnapshot";
import { StrategyEfficacyScore } from "../value-objects/StrategyEfficacyScore";
import { ReflectionResponse } from "../value-objects/ReflectionResponse";

interface InterventionProps {
  focusBlockId: UniqueEntityID;
  triggerType: InterventionTriggerType;
  calibrationData: CalibrationSnapshot;
  optionsOffered: UniqueEntityID[];
  selectedStrategyId?: UniqueEntityID;
  efficacy?: StrategyEfficacyScore;
  reflections?: ReflectionResponse[];
  createdAt?: Date;
}

export class Intervention extends Entity<InterventionProps> {
  // Accessors
  get focusBlockId(): UniqueEntityID { return this.props.focusBlockId; }
  get triggerType(): InterventionTriggerType { return this.props.triggerType; }
  get calibrationData(): CalibrationSnapshot { return this.props.calibrationData; }
  get selectedStrategyId(): UniqueEntityID | undefined { return this.props.selectedStrategyId; }
  get efficacy(): StrategyEfficacyScore | undefined { return this.props.efficacy; }
  get reflections(): ReflectionResponse[] { return this.props.reflections || []; }

  private constructor(props: InterventionProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(props: InterventionProps, id?: UniqueEntityID): Result<Intervention> {
    const guardResult = Guard.againstNullOrUndefined(props.focusBlockId, 'focusBlockId');
    if (guardResult.isFailure) return Result.fail<Intervention>(guardResult.error!);

    const calibrationGuard = Guard.againstNullOrUndefined(props.calibrationData, 'calibrationData');
    if (calibrationGuard.isFailure) return Result.fail<Intervention>(calibrationGuard.error!);

    if (props.optionsOffered.length > 3) {
      return Result.fail<Intervention>("Choice-Overload Rule: Max 3 strategies allowed.");
    }

    const intervention = new Intervention({
      ...props,
      reflections: props.reflections || [],
      createdAt: props.createdAt || new Date()
    }, id);

    DomainEvents.dispatch(new CalibrationCompleted(intervention._id, props.calibrationData));

    return Result.ok<Intervention>(intervention);
  }

  public selectStrategy(strategyId: UniqueEntityID): void {
    this.props.selectedStrategyId = strategyId;
    DomainEvents.dispatch(new StrategySelected(this._id, strategyId));
  }

  public dismiss(): void {
    this.props.efficacy = StrategyEfficacyScore.create({
      impact: StrategyImpact.DISMISSED,
      initialState: "N/A",
      resultingState: "N/A",
      analysisNote: "User opted out of scaffolding."
    });
  }

  public recordEfficacy(score: StrategyEfficacyScore): void {
    this.props.efficacy = score;
  }

  public addReflection(reflection: ReflectionResponse): void {
    if (!this.props.reflections) this.props.reflections = [];
    this.props.reflections.push(reflection);
  }
}