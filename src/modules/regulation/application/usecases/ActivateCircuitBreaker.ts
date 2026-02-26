import { UseCase } from "../../../../shared/core/UseCase";
import { Result } from "../../../../shared/core/Result";
import { RegulationRepository } from "../ports/output/RegulationRepository";
import { StateLabel } from "../../domain/value-objects/RegulationState";
import { DomainEvents } from "../../../../shared/domain/events/DomainEvents";
import { EmergencyExitActivated } from "../../domain/events/EmergencyExitActivated";
import { UniqueEntityID } from "../../../../shared/core/UniqueEntityID";

interface CircuitBreakerRequest {
  focusBlockId: string;
}

export class ActivateCircuitBreaker implements UseCase<CircuitBreakerRequest, any> {
  constructor(
    private regulationRepo: RegulationRepository
    // FocusBlockRepo removed to enforce decoupling
  ) {}

  async execute(request: CircuitBreakerRequest): Promise<Result<any>> {
    const session = await this.regulationRepo.findByFocusBlockId(request.focusBlockId);
    if (!session) return Result.fail("Regulation session not found");

    // 1. Update Regulation Internal State
    session.updateState(StateLabel.LOST);
    await this.regulationRepo.save(session);

    // 2. Dispatch Domain Event
    // This allows FocusBlock module (and potentially others like Analytics) 
    // to react without this UseCase knowing about them.
    DomainEvents.dispatch(
      new EmergencyExitActivated(new UniqueEntityID(request.focusBlockId))
    );

    return Result.ok({
      message: "Circuit breaker activated. Session aborted for your wellbeing.",
      newState: session.currentState.label,
      // We return 'ABANDONED' here for the API response as it's the expected result
      focusBlockStatus: "ABANDONED", 
      menu: ["TAKE_5", "SHRINK_TASK", "SAVE_FOR_LATER"] 
    });
  }
}