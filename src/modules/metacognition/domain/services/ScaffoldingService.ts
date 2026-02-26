import { Strategy } from "../entities/Strategy";
import { StrategyCategory } from "../entities/StrategyCategory";

export class ScaffoldingService {
  /**
   * Relevance Rule & Choice-Overload Rule
   * Limits to 3 strategies and filters by state.
   */
  public static selectBestStrategies(
    allStrategies: Strategy[], 
    regulationState: string
  ): Strategy[] {
    
    let filtered = allStrategies;

    // Relevance Rule Logic
    if (regulationState === 'OVERLOADED' || regulationState === 'DRAINED') {
      filtered = allStrategies.filter(s => 
        s.category === StrategyCategory.COGNITIVE_REDUCTION || 
        s.category === StrategyCategory.KINESTHETIC
      );
    } else if (regulationState === 'FLOW') {
      filtered = allStrategies.filter(s => s.category === StrategyCategory.ENHANCEMENT);
    }

    // Choice-Overload Rule: Max 3, randomized or prioritized
    return filtered.sort(() => 0.5 - Math.random()).slice(0, 3);
  }
}