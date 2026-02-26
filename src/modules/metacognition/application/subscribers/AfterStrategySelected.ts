import { IHandle } from "../../../../shared/domain/events/IHandle";
import { DomainEvents } from "../../../../shared/domain/events/DomainEvents";
import { StrategySelected } from "../../domain/events/StrategySelected";
import { RecordEfficacy } from "../../application/usecases/RecordEfficacy";

export class AfterStrategySelected implements IHandle<StrategySelected> {
  constructor(private recordEfficacy: RecordEfficacy) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    // Register the handler for the StrategySelected event
    DomainEvents.register(
      (event: StrategySelected) => this.onStrategySelected(event),
      StrategySelected.name
    );
  }

  private async onStrategySelected(event: StrategySelected): Promise<void> {
    const { interventionId } = event;

    console.log(`[Metacognition]: Strategy selected for intervention ${interventionId}. Starting 5-minute Effectiveness Window.`);

    /**
     * Effectiveness Window Rule: 
     * In a production environment, we'd use a job scheduler (e.g., BullMQ).
     * For the purpose of this implementation, we use a timeout to simulate the delay.
     */
    setTimeout(async () => {
      try {
        // In a real flow, we would fetch the LATEST RegulationState from the Regulation Context here
        // For now, we simulate a 'FLOW' state result to verify the learning loop.
        await this.recordEfficacy.execute({
          interventionId: interventionId.toString(),
          currentRegulationState: "FLOW" 
        });
        
        console.log(`[Metacognition]: Effectiveness Window closed for ${interventionId}. Efficacy recorded.`);
      } catch (err) {
        console.error(`[Metacognition Error]: Failed to record efficacy:`, err);
      }
    }, 5 * 60 * 1000); // 5 Minutes
  }
}