import { Symbol } from "../entities/Symbol"
import {EmptyValueError} from "../ErrorHandling/EmptyValueError";
import { InvalidValueError } from "../ErrorHandling/InvalidValueError";

export function generateSymbol(label: string, value: number) : Symbol {
  if (label.length === 0) {
    throw new EmptyValueError('Label cannot be empty');
  }
  if (value < 0 ) {
    throw new InvalidValueError('Value cannot be negative');
  }
  
  return new Symbol(label, value);
}
