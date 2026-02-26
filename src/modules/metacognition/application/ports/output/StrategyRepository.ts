import { Strategy } from "../../../domain/entities/Strategy";
import { StrategyCategory } from "../../../domain/entities/StrategyCategory";

export interface StrategyRepository {
  findAll(): Promise<Strategy[]>;
  findByCategory(category: StrategyCategory): Promise<Strategy[]>;
  findByIds(ids: string[]): Promise<Strategy[]>;
  save(strategy: Strategy): Promise<void>; // <--- Add this
}