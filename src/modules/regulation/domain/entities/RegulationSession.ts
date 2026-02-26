import { Entity } from "../../../../shared/core/Entity";
import { UniqueEntityID } from "../../../../shared/core/UniqueEntityID";
import { CognitiveLoad } from "../value-objects/CognitiveLoad";
import { RegulationState, StateLabel } from "../value-objects/RegulationState";

interface RegulationSessionProps {
  focusBlockId: string;
  currentState: RegulationState;
  loadHistory: CognitiveLoad[];
  lastUpdated: Date;
}

export class RegulationSession extends Entity<RegulationSessionProps> {
  private constructor(props: RegulationSessionProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(focusBlockId: string, id?: UniqueEntityID): RegulationSession {
    return new RegulationSession({
      focusBlockId,
      currentState: RegulationState.create(StateLabel.CALM),
      loadHistory: [],
      lastUpdated: new Date()
    }, id);
  }

  public addLoadSnapshot(load: CognitiveLoad): void {
    this.props.loadHistory.push(load);
    this.props.lastUpdated = new Date();
  }

  public updateState(label: StateLabel): void {
    this.props.currentState = RegulationState.create(label);
    this.props.lastUpdated = new Date();
  }

  // --- GETTERS (Crucial for Use Cases) ---

  get currentState(): RegulationState { 
    return this.props.currentState; 
  }

  /**
   * FIXED: Added this getter so NormalizeState can inspect the 
   * load history to determine the normalized label.
   */
  get loadHistory(): CognitiveLoad[] {
    return this.props.loadHistory;
  }

  get focusBlockId(): string {
    return this.props.focusBlockId;
  }
}