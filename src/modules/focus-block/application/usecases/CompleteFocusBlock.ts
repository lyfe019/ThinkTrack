import { UseCase } from "../../../../shared/core/UseCase";
import { Result } from "../../../../shared/core/Result";
import { FocusBlockRepository } from "../ports/output/FocusBlockRepository";
import { ExitMood } from "../../domain/value-objects/ExitMood";

interface CompleteRequest {
  focusBlockId: string;
  mood: string;
  outcome: string; // ACHIEVED, PARTIAL, NOT_ACHIEVED
}

export class CompleteFocusBlock implements UseCase<CompleteRequest, any> {
  constructor(private repo: FocusBlockRepository) {}

  async execute(request: CompleteRequest): Promise<Result<any>> {
    const block = await this.repo.findById(request.focusBlockId);
    if (!block) return Result.fail("Focus Block not found");

    const moodResult = ExitMood.create(request.mood || "");
    if (moodResult.isFailure) return Result.fail(moodResult.error!);

    block.complete(moodResult.getValue());
    await this.repo.save(block);

    // Intent Continuity Logic
    let suggestion = null;
    if (request.outcome === 'PARTIAL' || request.outcome === 'NOT_ACHIEVED') {
      suggestion = {
        type: 'CONTINUATION',
        reason: `Carry forward: ${block.props.intent.props.description}`
      };
    }

    return Result.ok({
      status: block.status,
      summary: "Focus session completed",
      suggestion: suggestion
    });
  }
}