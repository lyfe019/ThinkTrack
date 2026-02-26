import { Entity } from "../../../../shared/core/Entity";
import { UniqueEntityID } from "../../../../shared/core/UniqueEntityID";
import { Result } from "../../../../shared/core/Result";
import { EnergyLevel } from "../value-objects/EnergyLevel";
import { FocusDuration } from "../value-objects/FocusDuration";
import { MicroIntent } from "./MicroIntent";
import { TimeAdjustment } from "../value-objects/TimeAdjustment";
import { ExitMood } from "../value-objects/ExitMood";
import { CognitiveSignal } from "../value-objects/CognitiveSignal";

export enum FocusBlockStatus {
  PLANNED = 'PLANNED',
  ACTIVE = 'ACTIVE',
  META_CHECKPOINT = 'META_CHECKPOINT',
  SOFT_LANDING = 'SOFT_LANDING',
  COMPLETED = 'COMPLETED',
  ABANDONED = 'ABANDONED'
}

interface FocusBlockProps {
  status: FocusBlockStatus;
  energyLevel: EnergyLevel;
  duration: FocusDuration;
  startTime?: Date;
  targetEndTime?: Date;
  actualEndTime?: Date;
  intent: MicroIntent;
  createdAt?: Date;
  updatedAt?: Date;
}

export class FocusBlock extends Entity<FocusBlockProps> {
  private _adjustments: TimeAdjustment[] = [];
  private _signals: CognitiveSignal[] = []; 

  private constructor(props: FocusBlockProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(props: FocusBlockProps, id?: UniqueEntityID): Result<FocusBlock> {
    if (!props.intent || !props.duration) {
      return Result.fail<FocusBlock>("FocusBlock requires Intent and Duration.");
    }

    const now = new Date();
    const focusBlockProps = {
      ...props,
      createdAt: props.createdAt || now,
      updatedAt: props.updatedAt || now
    };

    return Result.ok<FocusBlock>(new FocusBlock(focusBlockProps, id));
  }

  private update(): void {
    this.props.updatedAt = new Date();
  }

  public initiate(): void {
    this.props.status = FocusBlockStatus.ACTIVE;
    this.props.startTime = new Date();
    this.props.targetEndTime = new Date(this.props.startTime.getTime() + this.props.duration.minutes * 60000);
    this.update();
  }

  public recordSignal(signal: CognitiveSignal): void {
    if (this.props.status === FocusBlockStatus.ACTIVE) {
      this._signals.push(signal);
    }
  }

  public applyAdjustment(minutes: number): Result<void> {
    const adjustmentResult = TimeAdjustment.create(minutes);
    if (adjustmentResult.isFailure) return Result.fail<void>(adjustmentResult.error!);

    if (minutes > 0) {
      const currentTotalSwell = this._adjustments
        .filter(a => a.props.minutes > 0)
        .reduce((sum, a) => sum + a.props.minutes, 0);
        
      if (currentTotalSwell + minutes > (this.props.duration.minutes * 2)) {
        this.props.status = FocusBlockStatus.META_CHECKPOINT;
        this.update();
        return Result.fail<void>("Hyperfocus limit reached. Please complete a metacognitive check.");
      }
    }

    this._adjustments.push(adjustmentResult.getValue());
    if (this.props.targetEndTime) {
      this.props.targetEndTime = new Date(this.props.targetEndTime.getTime() + (minutes * 60000));
    }
    this.update();
    return Result.ok<void>();
  }

  public triggerSoftLanding(): void { 
    this.props.status = FocusBlockStatus.SOFT_LANDING; 
    this.update();
  }

  public abort(): void {
    this.props.status = FocusBlockStatus.ABANDONED;
    this.props.actualEndTime = new Date();
    this.update();
  }

  public abandon(): void {
    this.abort();
  }

  public complete(mood: ExitMood): void {
    this.props.status = FocusBlockStatus.COMPLETED;
    this.props.actualEndTime = new Date();
    this.update();
  }

  get status(): FocusBlockStatus { return this.props.status; }
  get targetEndTime(): Date | undefined { return this.props.targetEndTime; }
  get startTime(): Date | undefined { return this.props.startTime; }
  get intent(): MicroIntent { return this.props.intent; }
  get duration(): FocusDuration { return this.props.duration; }
  get signals(): CognitiveSignal[] { return this._signals; }
  get createdAt(): Date { return this.props.createdAt!; }
  get updatedAt(): Date { return this.props.updatedAt!; }
}