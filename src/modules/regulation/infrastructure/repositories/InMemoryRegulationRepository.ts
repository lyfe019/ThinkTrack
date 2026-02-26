import { RegulationRepository } from "../../application/ports/output/RegulationRepository";
import { RegulationSession } from "../../domain/entities/RegulationSession";

export class InMemoryRegulationRepository implements RegulationRepository {
  private static instance: InMemoryRegulationRepository | null = null;
  private _sessions: Map<string, RegulationSession> = new Map();

  // Private constructor to enforce Singleton pattern
  private constructor() {}

  /**
   * Singleton pattern: Ensures all use cases (Estimate, Activate, Normalize)
   * share the same memory bank.
   */
  public static getInstance(): InMemoryRegulationRepository {
    if (!InMemoryRegulationRepository.instance) {
      InMemoryRegulationRepository.instance = new InMemoryRegulationRepository();
    }
    return InMemoryRegulationRepository.instance;
  }

  /**
   * Clears the shared sessions map. 
   * Call this in your 'Before' hooks in cucumber tests.
   */
  public static clear(): void {
    if (this.instance) {
      this.instance._sessions.clear();
    }
  }

  async save(session: RegulationSession): Promise<void> {
    /**
     * Using the .focusBlockId getter we added to the entity.
     * We map by focusBlockId for easy lookup during active sessions.
     */
    this._sessions.set(session.focusBlockId, session);
  }

  async findByFocusBlockId(id: string): Promise<RegulationSession | null> {
    const session = this._sessions.get(id);
    return session || null;
  }
}