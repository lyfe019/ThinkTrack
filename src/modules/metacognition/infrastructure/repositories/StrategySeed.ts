import { Strategy } from "../../domain/entities/Strategy";
import { StrategyCategory } from "../../domain/entities/StrategyCategory";
import { UniqueEntityID } from "../../../../shared/core/UniqueEntityID";
import { NDSuitability } from "../../domain/value-objects/NDSuitability";

const defaultSuitability = NDSuitability.create({
  isADHDFriendly: true,
  isAutisticFriendly: true,
  isDyslexicFriendly: true,
  supportsExecutiveFunction: true
});

export const seedStrategies = [
  Strategy.create({
    label: "Active Recall",
    category: StrategyCategory.ENHANCEMENT,
    description: "Test your knowledge through retrieval practice.",
    requiredRegulationState: "FLOW",
    suitability: defaultSuitability
  }, new UniqueEntityID("active-recall-123")).getValue(),
  
  Strategy.create({
    label: "Body Doubling",
    category: StrategyCategory.COGNITIVE_REDUCTION,
    description: "Working alongside someone to maintain focus.",
    requiredRegulationState: "STUCK",
    suitability: defaultSuitability
  }, new UniqueEntityID("body-doubling-456")).getValue()
];