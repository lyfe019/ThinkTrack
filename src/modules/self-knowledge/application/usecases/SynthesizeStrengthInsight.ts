// src/modules/self-knowledge/application/usecases/SynthesizeStrengthInsight.ts

import { UseCase } from "../../../../shared/core/UseCase";
import { Result } from "../../../../shared/core/Result";
import { UniqueEntityID } from "../../../../shared/core/UniqueEntityID";
import { LearningProfileRepository } from "../ports/output/LearningProfileRepository";
import { Insight, InsightStatus } from "../../domain/entities/Insight";
import { ReframedInsight, InsightTone, InsightCategory } from "../../domain/value-objects/ReframedInsight";

interface SynthesizeRequest {
  userId: string;
  detectedPattern: string; // e.g., "High frequency of rereading after 20 mins"
  evidenceBlockIds: string[]; // FocusBlock IDs that prove this pattern
}

export class SynthesizeStrengthInsight implements UseCase<SynthesizeRequest, void> {
  constructor(
    private profileRepo: LearningProfileRepository
    // In a real app, you might inject a ReframeService or Dictionary here
  ) {}

  async execute(request: SynthesizeRequest): Promise<Result<void>> {
    try {
      // 1. Fetch the User's Aggregate Root
      const profile = await this.profileRepo.getByUserId(request.userId);
      if (!profile) {
        return Result.fail<void>(`Learning Profile for user ${request.userId} not found`);
      }

      // 2. Logic: Translate raw pattern to a Strength (Simulating Dictionary lookup)
      // Rule: "Inconsistent" -> "Adaptable Explorer"
      const reframedContent = this.applyReframingLogic(request.detectedPattern);

      // 3. Create the Value Object (Triggers Strength-First Invariant)
      const reframedVOrResult = ReframedInsight.create({
        content: reframedContent,
        tone: InsightTone.EMPOWERING,
        category: InsightCategory.STAMINA
      });

      if (reframedVOrResult.isFailure) {
        return Result.fail<void>(reframedVOrResult.error!);
      }

      // 4. Create the Insight Entity (Triggers Evidence-Base Requirement: 3+ blocks)
      const evidenceLinks = request.evidenceBlockIds.map(id => new UniqueEntityID(id));
      
      const insightResult = Insight.create({
        rawPattern: request.detectedPattern,
        reframedText: reframedVOrResult.getValue(),
        evidenceLinks: evidenceLinks,
        status: InsightStatus.NEW
      });

      if (insightResult.isFailure) {
        return Result.fail<void>(insightResult.error!);
      }

      // 5. Update Aggregate and Persist
      profile.addInsight(insightResult.getValue());
      await this.profileRepo.save(profile);

      return Result.ok<void>();

    } catch (err) {
      return Result.fail<void>(err instanceof Error ? err.message : String(err));
    }
  }

  private applyReframingLogic(pattern: string): string {
    // Simple mock of the StrengthReframingDictionary
    if (pattern.includes("distracted")) return "You have high environmental awareness and notice details others miss.";
    if (pattern.includes("fatigue")) return "Your brain thrives on intense, short-burst deep dives.";
    return `Strength-Reframed: ${pattern}`;
  }
}