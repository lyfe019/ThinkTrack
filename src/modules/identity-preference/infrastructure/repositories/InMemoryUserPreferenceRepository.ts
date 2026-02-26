import { IUserPreferenceRepo } from "../../application/ports/output/IUserPreferenceRepo";
import { UserPreference } from "../../domain/entities/UserPreference";

export class InMemoryUserPreferenceRepository implements IUserPreferenceRepo {
  private static instance: InMemoryUserPreferenceRepository;
  private preferences: Map<string, UserPreference> = new Map();

  private constructor() {}

  public static getInstance(): InMemoryUserPreferenceRepository {
    if (!this.instance) {
      this.instance = new InMemoryUserPreferenceRepository();
    }
    return this.instance;
  }

  async getByUserId(userId: string): Promise<UserPreference | null> {
    const pref = this.preferences.get(userId);
    return pref ? pref : null;
  }

  async save(preference: UserPreference): Promise<void> {
    this.preferences.set(preference.userId.toString(), preference);
  }
}