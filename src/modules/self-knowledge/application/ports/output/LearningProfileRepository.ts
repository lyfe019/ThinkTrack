// src/modules/self-knowledge/application/ports/output/LearningProfileRepository.ts

import { LearningProfile } from "../../../domain/entities/LearningProfile";

export interface LearningProfileRepository {
  getByUserId(userId: string): Promise<LearningProfile | null>;
  save(profile: LearningProfile): Promise<void>;
}