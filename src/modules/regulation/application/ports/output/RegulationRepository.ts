import { RegulationSession } from "../../../domain/entities/RegulationSession";

export interface RegulationRepository {
  save(session: RegulationSession): Promise<void>;
  findByFocusBlockId(id: string): Promise<RegulationSession | null>;
}