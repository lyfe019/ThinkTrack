import { Result } from "../../../../shared/core/Result";
import { IUserPreferenceRepo } from "../ports/output/IUserPreferenceRepo";

export class UpdatePreferencesUseCase {
  constructor(private userPreferenceRepo: IUserPreferenceRepo) {}

  async execute(request: any): Promise<Result<void>> {
    const { userId, duration, atmosphere } = request;

    try {
      const preference = await this.userPreferenceRepo.getByUserId(userId);
      if (!preference) return Result.fail("User preferences not found");

      // Apply Process 4 logic
      if (duration) {
        preference.recordOverride("defaultFocusBlockDuration", duration);
      }

      // Apply Process 3 logic
      if (atmosphere) {
        preference.manuallySetAtmosphere(atmosphere);
      }

      await this.userPreferenceRepo.save(preference);
      return Result.ok<void>();
    } catch (err: any) {
      return Result.fail(err.message);
    }
  }
}