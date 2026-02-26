import { DomainEvents } from "../../../../shared/domain/events/DomainEvents";
import { IHandle } from "../../../../shared/domain/events/IHandle";
import { EmergencyExitActivated } from "../../../regulation/domain/events/EmergencyExitActivated";
import { FocusBlockRepository } from "../ports/output/FocusBlockRepository";

export class AfterEmergencyExit implements IHandle<EmergencyExitActivated> {
  constructor(private focusBlockRepo: FocusBlockRepository) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      (event: EmergencyExitActivated) => this.onEmergencyExit(event),
      EmergencyExitActivated.name
    );
  }

  private async onEmergencyExit(event: EmergencyExitActivated): Promise<void> {
    const focusBlockId = event.getAggregateId().toString();

    try {
      const focusBlock = await this.focusBlockRepo.findById(focusBlockId);
      
      if (focusBlock) {
        // Change status using domain method
        focusBlock.abandon(); 
        
        // CRITICAL: Await the save so the event bus knows when work is done
        await this.focusBlockRepo.save(focusBlock);
        
        console.log(`[FocusBlock Subscriber]: Block ${focusBlockId} has been ABANDONED due to Emergency Exit.`);
      } else {
        console.warn(`[FocusBlock Subscriber]: Received exit event for unknown block: ${focusBlockId}`);
      }
    } catch (err) {
      console.error(`[FocusBlock Subscriber]: Error processing emergency exit for ${focusBlockId}`, err);
    }
  }
}