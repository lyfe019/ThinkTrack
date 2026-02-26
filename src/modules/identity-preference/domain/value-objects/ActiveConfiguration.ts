// src/modules/identity-preference/domain/value-objects/ActiveConfiguration.ts
import { ValueObject } from "../../../../shared/core/ValueObject";
import { UIComplexity } from "./UIComplexity";
import { VisualAtmosphere } from "./VisualAtmosphere";

interface ActiveConfigProps {
  defaultFocusBlockDuration: number;
  promptFrequency: number;
  uiComplexity: UIComplexity;
  atmosphere: VisualAtmosphere;      // Added for Process 3
  notificationsMuted: boolean;       // Added for Process 3
}

export class ActiveConfiguration extends ValueObject<ActiveConfigProps> {
  get defaultDuration(): number { return this.props.defaultFocusBlockDuration; }
  get promptFrequency(): number { return this.props.promptFrequency; }
  get uiComplexity(): UIComplexity { return this.props.uiComplexity; }
  get atmosphere(): VisualAtmosphere { return this.props.atmosphere; }
  get notificationsMuted(): boolean { return this.props.notificationsMuted; }

  public static create(props: ActiveConfigProps): ActiveConfiguration {
    return new ActiveConfiguration(props);
  }
}