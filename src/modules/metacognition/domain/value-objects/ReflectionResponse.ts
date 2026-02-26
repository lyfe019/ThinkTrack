import { ValueObject } from "../../../../shared/core/ValueObject";

interface ReflectionProps {
  prompt: string;
  response: string;
  energyImpact: 'TIRING' | 'NEUTRAL' | 'ENERGIZING';
  occurredAt: Date;
}

export class ReflectionResponse extends ValueObject<ReflectionProps> {
  get prompt(): string { return this.props.prompt; }
  get response(): string { return this.props.response; }
  get energyImpact(): string { return this.props.energyImpact; }
  get occurredAt(): Date { return this.props.occurredAt; }

  private constructor(props: ReflectionProps) {
    super(props);
  }

  public static create(props: ReflectionProps): ReflectionResponse {
    return new ReflectionResponse({
      ...props,
      occurredAt: props.occurredAt || new Date()
    });
  }
}