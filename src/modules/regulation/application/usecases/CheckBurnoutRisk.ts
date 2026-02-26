import { UseCase } from "../../../../shared/core/UseCase";
import { Result } from "../../../../shared/core/Result";
import { RegulationRepository } from "../ports/output/RegulationRepository";
import { LoadLevel, LoadVelocity } from "../../domain/value-objects/CognitiveLoad";

export class CheckBurnoutRisk implements UseCase<{ focusBlockId: string }, any> {
  constructor(private repo: RegulationRepository) {}

  async execute(request: { focusBlockId: string }): Promise<Result<any>> {
    const session = await this.repo.findByFocusBlockId(request.focusBlockId);
    if (!session) return Result.fail("Regulation session not found");

    /**
     * CORRELATION FIX: Use the 'loadHistory' getter we added to the entity.
     * Accessing .props directly is restricted.
     */
    const history = session.loadHistory;
    
    // Process 4 Logic: Check if the last 3 snapshots are all HEAVY and not FALLING
    if (history.length < 3) return Result.ok({ warningTriggered: false });

    const isRedlining = history.slice(-3).every(
      snapshot => snapshot.level === LoadLevel.HEAVY && snapshot.velocity !== LoadVelocity.FALLING
    );

    if (isRedlining) {
      return Result.ok({
        warningTriggered: true,
        event: "COGNITIVE_LOAD_EXCEEDED",
        prompt: "You've been working hard. Would a 2-minute stretch help?"
      });
    }

    return Result.ok({ warningTriggered: false });
  }
}