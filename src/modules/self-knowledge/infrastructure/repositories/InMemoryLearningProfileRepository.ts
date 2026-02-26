// src/modules/self-knowledge/infrastructure/repositories/InMemoryLearningProfileRepository.ts

import { LearningProfile } from "../../domain/entities/LearningProfile";
import { LearningProfileRepository } from "../../application/ports/output/LearningProfileRepository";

export class InMemoryLearningProfileRepository implements LearningProfileRepository {
  private static instance: InMemoryLearningProfileRepository;
  private profiles: Map<string, LearningProfile> = new Map();

  private constructor() {}

  /**
   * Singleton pattern to ensure we use the same in-memory store 
   * across the entire Self-Knowledge context.
   */
  public static getInstance(): InMemoryLearningProfileRepository {
    if (!InMemoryLearningProfileRepository.instance) {
      InMemoryLearningProfileRepository.instance = new InMemoryLearningProfileRepository();
    }
    return InMemoryLearningProfileRepository.instance;
  }

  /**
   * Finds a profile by the associated UserId string.
   */
  async getByUserId(userId: string): Promise<LearningProfile | null> {
    // In a real DB, this would be a query on the userId column
    const profile = Array.from(this.profiles.values()).find(
      (p) => p.props.userId.toValue().toString() === userId
    );
    return profile || null;
  }

  /**
   * Persists the Aggregate Root.
   */
  async save(profile: LearningProfile): Promise<void> {
    this.profiles.set(profile.id.toString(), profile);
  }

  /**
   * Helper for testing: Clears all data
   */
  public clear(): void {
    this.profiles.clear();
  }
}