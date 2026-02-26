import { FocusBlockRepository } from "../../application/ports/output/FocusBlockRepository";
import { FocusBlock, FocusBlockStatus } from "../../domain/entities/FocusBlock";

export class InMemoryFocusBlockRepository implements FocusBlockRepository {
  private items: Map<string, FocusBlock> = new Map();

  private constructor() {}

  public static getInstance(): InMemoryFocusBlockRepository {
    const REPO_KEY = Symbol.for("thinktrack.focusblock.repository");
    const globalAny = global as any;

    if (!globalAny[REPO_KEY]) {
      globalAny[REPO_KEY] = new InMemoryFocusBlockRepository();
    }
    
    return globalAny[REPO_KEY];
  }

  public static clear(): void {
    const instance = this.getInstance();
    instance.items.clear();
  }

  async findById(id: string): Promise<FocusBlock | null> {
    const item = this.items.get(id);
    return item ? item : null;
  }

  async findActiveByUserId(userId: string): Promise<FocusBlock | null> {
    const allBlocks = Array.from(this.items.values());
    return allBlocks.find(block => block.status === FocusBlockStatus.ACTIVE) || null;
  }

  async findLastAbandonedByUserId(userId: string): Promise<FocusBlock | null> {
    const abandonedBlocks = Array.from(this.items.values())
      .filter(block => block.status === FocusBlockStatus.ABANDONED)
      .sort((a, b) => {
        const timeA = a.updatedAt?.getTime() || 0;
        const timeB = b.updatedAt?.getTime() || 0;
        return timeB - timeA;
      });

    return abandonedBlocks.length > 0 ? abandonedBlocks[0] : null;
  }

  async save(focusBlock: FocusBlock): Promise<void> {
    const id = focusBlock.id.toString();
    // We explicitly delete and re-set to ensure the Map reference is fresh
    this.items.delete(id);
    this.items.set(id, focusBlock);
  }
}