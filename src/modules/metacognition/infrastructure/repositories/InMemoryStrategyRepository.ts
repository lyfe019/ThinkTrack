import { StrategyRepository } from "../../application/ports/output/StrategyRepository";
import { Strategy } from "../../domain/entities/Strategy";
import { StrategyCategory } from "../../domain/entities/StrategyCategory";

export class InMemoryStrategyRepository implements StrategyRepository {
  private strategies: Strategy[] = [];

  async findAll(): Promise<Strategy[]> { 
    return this.strategies; 
  }
  
  async findByCategory(category: StrategyCategory): Promise<Strategy[]> {
    return this.strategies.filter(s => s.category === category);
  }

  async findByIds(ids: string[]): Promise<Strategy[]> {
    // Ensure we compare strings to strings
    return this.strategies.filter(s => ids.includes(s.id.toString()));
  }

  async save(strategy: Strategy): Promise<void> {
    this.strategies.push(strategy);
  }
}