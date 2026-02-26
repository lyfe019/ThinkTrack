import { UseCase } from "../../../../shared/core/UseCase";
import { Result } from "../../../../shared/core/Result";
import { FocusBlock, FocusBlockStatus } from "../../domain/entities/FocusBlock";
import { EnergyLevel } from "../../domain/value-objects/EnergyLevel";
import { FocusDuration } from "../../domain/value-objects/FocusDuration";
import { MicroIntent } from "../../domain/entities/MicroIntent";
import { FocusBlockRepository } from "../ports/output/FocusBlockRepository";

interface InitiateRequest {
  energyLevel: string;
  minutes: number;
  intentDescription: string;
  userId: string; 
}

interface InitiateResponse {
  focusBlockId: string;
  status: string;
  targetEndTime: Date;
}

export class InitiateFocusBlock implements UseCase<InitiateRequest, InitiateResponse> {
  constructor(private focusBlockRepo: FocusBlockRepository) {}

  async execute(request: InitiateRequest): Promise<Result<InitiateResponse>> {
    // 1. Value Object Creation
    const energyResult = EnergyLevel.create(request.energyLevel);
    const durationResult = FocusDuration.create(request.minutes);
    const intentResult = MicroIntent.create(request.intentDescription);

    if (energyResult.isFailure) return Result.fail(energyResult.error!);
    if (durationResult.isFailure) return Result.fail(durationResult.error!);
    if (intentResult.isFailure) return Result.fail(intentResult.error!);

    // 2. CHECK FOR COOL-DOWN FIRST
    // We look for the most recently updated block for this user
    const lastAbandoned = await this.focusBlockRepo.findLastAbandonedByUserId(request.userId);
    
    if (lastAbandoned && lastAbandoned.status === FocusBlockStatus.ABANDONED) {
      const now = new Date();
      const secondsSinceExit = (now.getTime() - lastAbandoned.updatedAt.getTime()) / 1000;
      
      if (secondsSinceExit < 60) {
        const remaining = Math.ceil(60 - secondsSinceExit);
        return Result.fail(`Cool-down active. Please wait ${remaining}s to regulate your nervous system before restarting.`);
      }
    }

    // 3. IMPROVED ACTIVE CHECK
    const existingActive = await this.focusBlockRepo.findActiveByUserId(request.userId);
    if (existingActive) {
      // If we find an active block, but a "Cool-down" should have been triggered 
      // (e.g., the event is still processing), we calculate the gap anyway.
      const now = new Date();
      const secondsSinceLastUpdate = (now.getTime() - existingActive.updatedAt.getTime()) / 1000;

      // If the existing block was updated less than 60s ago AND the user is trying to restart,
      // it's highly likely they just exited.
      if (secondsSinceLastUpdate < 60) {
          const remaining = Math.ceil(60 - secondsSinceLastUpdate);
          return Result.fail(`Cool-down active. Please wait ${remaining}s to regulate your nervous system before restarting.`);
      }

      return Result.fail("You already have an active focus container.");
    }

    // 4. Create and Initiate
    const focusBlockResult = FocusBlock.create({
      status: FocusBlockStatus.PLANNED,
      energyLevel: energyResult.getValue(),
      duration: durationResult.getValue(),
      intent: intentResult.getValue()
    });

    if (focusBlockResult.isFailure) return Result.fail(focusBlockResult.error!);

    const focusBlock = focusBlockResult.getValue();
    focusBlock.initiate();

    await this.focusBlockRepo.save(focusBlock);

    return Result.ok({
      focusBlockId: focusBlock.id,
      status: focusBlock.status,
      targetEndTime: focusBlock.targetEndTime!
    });
  }
}