export class EmptyValueError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EmptyValueError';
    Object.setPrototypeOf(this, EmptyValueError.prototype);
  }
}