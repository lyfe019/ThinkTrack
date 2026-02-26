import { ValueObject } from "../../../../shared/core/ValueObject";

interface NDSuitabilityProps {
  isADHDFriendly: boolean;
  isAutisticFriendly: boolean;
  isDyslexicFriendly: boolean;
  supportsExecutiveFunction: boolean;
}

export class NDSuitability extends ValueObject<NDSuitabilityProps> {
  private constructor(props: NDSuitabilityProps) {
    super(props);
  }

  public static create(props: NDSuitabilityProps): NDSuitability {
    return new NDSuitability(props);
  }
}