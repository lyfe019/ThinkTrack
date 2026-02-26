import { Intervention } from "../../domain/entities/Intervention";
import { InterventionRepository } from "../../application/ports/output/InterventionRepository";

export class InMemoryInterventionRepository implements InterventionRepository {
  private static instance: InMemoryInterventionRepository;
  private interventions: Map<string, Intervention> = new Map();

  private constructor() {}

  public static getInstance(): InMemoryInterventionRepository {
    if (!InMemoryInterventionRepository.instance) {
      InMemoryInterventionRepository.instance = new InMemoryInterventionRepository();
    }
    return InMemoryInterventionRepository.instance;
  }

  async save(intervention: Intervention): Promise<void> {
    this.interventions.set(intervention.id.toString(), intervention);
  }

  // FIX: Convert undefined to null to match the InterventionRepository interface
  async getById(id: string): Promise<Intervention | null> {
    const intervention = this.interventions.get(id);
    return intervention || null; 
  }
}