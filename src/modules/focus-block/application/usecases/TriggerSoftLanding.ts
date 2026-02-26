import { UseCase } from "../../../../shared/core/UseCase";
import { Result } from "../../../../shared/core/Result";
import { FocusBlockRepository } from "../ports/output/FocusBlockRepository";

interface TriggerRequest {
  focusBlockId: string;
}

export class TriggerSoftLanding implements UseCase<TriggerRequest, any> {
  constructor(private repo: FocusBlockRepository) {}

  async execute(request: TriggerRequest): Promise<Result<any>> {
    const block = await this.repo.findById(request.focusBlockId);
    if (!block) return Result.fail("Focus Block not found");

    block.triggerSoftLanding();
    await this.repo.save(block);

    return Result.ok({
      status: block.status,
      message: "Soft landing initiated. Please review your session."
    });
  }
}