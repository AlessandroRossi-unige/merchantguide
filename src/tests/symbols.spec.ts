import {generateSymbol} from "../utils/symbols";
import {EmptyValueError} from "../ErrorHandling/EmptyValueError";
import {InvalidValueError} from "../ErrorHandling/InvalidValueError";

describe('Symbol functions test suite', () => {
  test('generateSymbol empty label', () => {
    function generateSymbolFunc() {
      generateSymbol('', 12);
    }
    expect(generateSymbolFunc).toThrow(EmptyValueError);
    expect(generateSymbolFunc).toThrow('Label cannot be empty');
  });
  
  test('generateSymbol negative value', () => {
    function generateSymbolFunc() {
      generateSymbol('valid', -12);
    }
    expect(generateSymbolFunc).toThrow(InvalidValueError);
    expect(generateSymbolFunc).toThrow('Value cannot be negative');
  });
})