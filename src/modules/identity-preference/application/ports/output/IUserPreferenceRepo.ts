import { UserPreference } from "../../../domain/entities/UserPreference";

/**
 * Port for the UserPreference Repository.
 * Defines the contract for persisting and retrieving Preference Aggregates.
 */
export interface IUserPreferenceRepo {
  /**
   * Retrieves a UserPreference by the associated UserId string.
   */
  getByUserId(userId: string): Promise<UserPreference | null>;

  /**
   * Persists the UserPreference aggregate root.
   */
  save(preference: UserPreference): Promise<void>;
}