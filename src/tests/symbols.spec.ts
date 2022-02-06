import {generateSymbol, getSymbolsFromFile, inputParser} from "../utils/symbols-parsing";
import {EmptyValueError} from "../ErrorHandling/EmptyValueError";
import {InvalidValueError} from "../ErrorHandling/InvalidValueError";
import {Symbol} from "../entities/Symbol"
import {SymbolTable} from "../interfaces/SymbolTable";

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
  
  test('generateSymbol valid input, returns OK', () => {
    let newSymbol = generateSymbol('X', 10);
    expect(newSymbol.label).toEqual('X');
    expect(newSymbol.value).toEqual(10);
  });
  
  test('generateSymbol valid input, returns OK', () => {
    let newSymbol = generateSymbol('X', 10);
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
    validSymbols['I'] = new Symbol('I', 1);
    validSymbols['V'] = new Symbol('V', 5);
    validSymbols['L'] = new Symbol('L', 50);
    validSymbols['X'] = new Symbol('X', 10);
    validSymbols['C'] = new Symbol('C', 100);
    validSymbols['D'] = new Symbol('D', 500);
    validSymbols['M'] = new Symbol('M', 1000);
  });
  
  test('inputParser empty array throws error', () => {
    function inputParserFunc() {
      inputParser('', validSymbols);
    }
    expect(inputParserFunc).toThrow(EmptyValueError);
    expect(inputParserFunc).toThrow('ValueToParse cannot be empty');
  });test('inputParser input has non valid symbol', () => {
    function inputParserFunc() {
      inputParser('Z', validSymbols);
    }
    expect(inputParserFunc).toThrow(EmptyValueError);
    expect(inputParserFunc).toThrow('ValueToParse cannot be empty');
  });
})