import { FocusBlock } from "../../../domain/entities/FocusBlock";

export interface FocusBlockRepository {
  save(focusBlock: FocusBlock): Promise<void>;
  findById(id: string): Promise<FocusBlock | null>;
  findActiveByUserId(userId: string): Promise<FocusBlock | null>;
  /**
   * Business Rule 4: Finds the most recently abandoned block 
   * to check if the 1-minute recovery window has passed.
   */
  findLastAbandonedByUserId(userId: string): Promise<FocusBlock | null>;
}