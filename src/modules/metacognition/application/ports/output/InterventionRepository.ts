import { Intervention } from "../../../domain/entities/Intervention";

export interface InterventionRepository {
  getById(id: string): Promise<Intervention | null>;
  save(intervention: Intervention): Promise<void>;
}