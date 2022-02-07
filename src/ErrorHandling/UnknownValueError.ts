export class UnknownValueError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UnknownValueError';
  }
}