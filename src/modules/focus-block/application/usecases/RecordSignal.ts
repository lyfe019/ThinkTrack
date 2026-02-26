import { UseCase } from "../../../../shared/core/UseCase";
import { Result } from "../../../../shared/core/Result";
import { FocusBlockRepository } from "../ports/output/FocusBlockRepository";
import { CognitiveSignal } from "../../domain/value-objects/CognitiveSignal";

interface SignalRequest {
  focusBlockId: string;
  type: string;
  metadata?: any;
}

export class RecordSignal implements UseCase<SignalRequest, any> {
  constructor(private repo: FocusBlockRepository) {}

  async execute(request: SignalRequest): Promise<Result<any>> {
    const block = await this.repo.findById(request.focusBlockId);
    if (!block) return Result.fail("Focus Block not found");

    const signalResult = CognitiveSignal.create(request.type, request.metadata);
    if (signalResult.isFailure) return Result.fail(signalResult.error!);

    block.recordSignal(signalResult.getValue());
    await this.repo.save(block);

    return Result.ok({ signalCount: block.signals.length });
  }
}