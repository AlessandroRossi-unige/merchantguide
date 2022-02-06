import {generateSymbol, getSymbolsFromFile, inputParser} from "../utils/symbols-parsing";
import {EmptyValueError} from "../ErrorHandling/EmptyValueError";
import {InvalidValueError} from "../ErrorHandling/InvalidValueError";
import {Symbol} from "../entities/Symbol"
import {SymbolTable} from "../interfaces/SymbolTable";
import {InvalidSyntaxError} from "../ErrorHandling/InvalidSyntaxError";

describe('Symbol functions test suite', () => {
  test('generateSymbol empty label', () => {
    function generateSymbolFunc() {
      generateSymbol('', 12, 3);
    }
    expect(generateSymbolFunc).toThrow(EmptyValueError);
    expect(generateSymbolFunc).toThrow('Label cannot be empty');
  });
  
  test('generateSymbol negative value', () => {
    function generateSymbolFunc() {
      generateSymbol('valid', -12, 3);
    }
    expect(generateSymbolFunc).toThrow(InvalidValueError);
    expect(generateSymbolFunc).toThrow('Value cannot be negative');
  });
  
  test('generateSymbol valid input, returns OK', () => {
    let newSymbol = generateSymbol('X', 10, 3);
    expect(newSymbol.label).toEqual('X');
    expect(newSymbol.value).toEqual(10);
  });
  
  test('generateSymbol valid input, returns OK', () => {
    let newSymbol = generateSymbol('X', 10, 3);
    expect(newSymbol.label).toEqual('X');
    expect(newSymbol.value).toEqual(10);
  });
  
  test('getValuesFromFile reads and generates 7 symbols', () => {
    expect(getSymbolsFromFile().length).toEqual(7);
  });
});

describe('Symbol parsing test suite', () => {
  let validSymbols: SymbolTable<Symbol> = {};
  beforeAll(() => {
    validSymbols['I'] = new Symbol('I', 1, 3);
    validSymbols['V'] = new Symbol('V', 5, 1);
    validSymbols['X'] = new Symbol('X', 10, 3);
    validSymbols['L'] = new Symbol('L', 50, 1);
    validSymbols['C'] = new Symbol('C', 100, 3);
    validSymbols['D'] = new Symbol('D', 500, 1);
    validSymbols['M'] = new Symbol('M', 1000, 3);
  });
  
  test('inputParser empty array throws error', () => {
    function inputParserFunc() {
      inputParser('', validSymbols);
    }
    expect(inputParserFunc).toThrow(EmptyValueError);
    expect(inputParserFunc).toThrow('ValueToParse cannot be empty');
  });
  test('inputParser input has non valid symbol', () => {
    function inputParserFunc() {
      inputParser('Z', validSymbols);
    }
    expect(inputParserFunc).toThrow(InvalidValueError);
    expect(inputParserFunc).toThrow(`Symbol: 'Z' at index 0 is not recognised`);
  });
  
  test('inputParser reads input of length 1 OK', () => {
    let result: Symbol[] = inputParser('I', validSymbols);
    expect(result.length).toEqual(1);
    expect(result[0].label).toEqual('I');
    expect(result[0].value).toEqual(1);
  });
  
  test('inputParser symbol cannot be repeated', () => {
    function inputParserFunc() {
      inputParser('VV', validSymbols);
    }
    expect(inputParserFunc).toThrow(InvalidSyntaxError);
    expect(inputParserFunc).toThrow(`symbol 'V' at index 1 cannot be repeated 2 times`);
  });
  
})