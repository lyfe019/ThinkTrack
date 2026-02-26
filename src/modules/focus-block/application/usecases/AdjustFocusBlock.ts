import { UseCase } from "../../../../shared/core/UseCase";
import { Result } from "../../../../shared/core/Result";
import { FocusBlockRepository } from "../ports/output/FocusBlockRepository";

interface AdjustRequest {
  focusBlockId: string;
  minutes: number;
}

interface AdjustResponse {
  status: string;
  targetEndTime: Date | undefined;
}

export class AdjustFocusBlock implements UseCase<AdjustRequest, AdjustResponse> {
  constructor(private repo: FocusBlockRepository) {}

  async execute(request: AdjustRequest): Promise<Result<AdjustResponse>> {
    const block = await this.repo.findById(request.focusBlockId);
    
    if (!block) {
      return Result.fail<AdjustResponse>("Focus Block not found");
    }

    // Delegate to Domain Entity which now returns a Result (checking Swell Limit)
    const adjustmentResult = block.applyAdjustment(request.minutes);

    // We save even if it fails because the status might have changed to META_CHECKPOINT
    await this.repo.save(block);

    if (adjustmentResult.isFailure) {
      return Result.fail<AdjustResponse>(adjustmentResult.error!);
    }

    return Result.ok<AdjustResponse>({
      status: block.status,
      targetEndTime: block.targetEndTime
    });
  }
}