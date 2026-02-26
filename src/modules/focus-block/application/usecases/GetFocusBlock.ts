import { UseCase } from "../../../../shared/core/UseCase";
import { Result } from "../../../../shared/core/Result";
import { FocusBlockRepository } from "../ports/output/FocusBlockRepository";

export class GetFocusBlock implements UseCase<string, any> {
  constructor(private repo: FocusBlockRepository) {}

  async execute(id: string): Promise<Result<any>> {
    const focusBlock = await this.repo.findById(id);
    
    if (!focusBlock) {
      return Result.fail("Focus Block not found");
    }

    /**
     * Now that FocusBlock entity has the startTime getter, 
     * this mapping will pass TypeScript compilation.
     */
return Result.ok({
      id: focusBlock.id.toString(),
      status: focusBlock.status,
      startTime: focusBlock.startTime,
      targetEndTime: focusBlock.targetEndTime,
      // Use .description because that is what we defined in MicroIntent
      intent: focusBlock.intent.description, 
      minutes: focusBlock.duration.minutes
    });
  }
}