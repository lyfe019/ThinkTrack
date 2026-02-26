import { UniqueEntityID } from "./UniqueEntityID";

const isEntity = (v: any): v is Entity<any> => {
  return v instanceof Entity;
};

export abstract class Entity<T> {
  protected readonly _id: UniqueEntityID;
  public readonly props: T;

  // We now accept UniqueEntityID to match our Domain-Driven design
  constructor(props: T, id?: UniqueEntityID) {
    this._id = id ? id : new UniqueEntityID();
    this.props = props;
  }

  /**
   * Returns the raw value of the ID (string or number)
   */
  get id(): string {
    return this._id.toValue().toString();
  }

  /**
   * Entities are compared by their Identity (_id), 
   * not by their current property values.
   */
  public equals(object?: Entity<T>): boolean {
    if (object == null || object == undefined) {
      return false;
    }

    if (this === object) {
      return true;
    }

    if (!isEntity(object)) {
      return false;
    }

    return this._id.equals(object._id);
  }
}