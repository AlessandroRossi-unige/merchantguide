import {
  calculateAmount,
  calculateAmountFromSymbols,
  generateSymbol,
  /*getSymbolsFromFile,*/
  inputParser
} from "../utils/symbols-parsing";
import {EmptyValueError} from "../ErrorHandling/EmptyValueError";
import {InvalidValueError} from "../ErrorHandling/InvalidValueError";
import {Symbol} from "../entities/Symbol"
import {SymbolTable} from "../interfaces/SymbolTable";
import {InvalidSyntaxError} from "../ErrorHandling/InvalidSyntaxError";

let validSymbols: SymbolTable<Symbol> = {};
validSymbols['I'] = new Symbol('I', 1, 3);
validSymbols['V'] = new Symbol('V', 5, 1, 'I');
validSymbols['X'] = new Symbol('X', 10, 3, 'I');
validSymbols['L'] = new Symbol('L', 50, 1, 'X');
validSymbols['C'] = new Symbol('C', 100, 3, 'X');
validSymbols['D'] = new Symbol('D', 500, 1, 'C');
validSymbols['M'] = new Symbol('M', 1000, 3, 'C');

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
  
  /*test('getValuesFromFile reads and generates 7 symbols', () => {
    expect(getSymbolsFromFile().length).toEqual(7);
  });*/
});

describe('Symbol parsing test suite', () => {
  
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
    expect(inputParserFunc).toThrow(`Symbol 'V' at index 1 cannot be repeated 2 times`);
  });
  
  test('inputParser reads input of length 3 repeated 3 times OK', () => {
    let result: Symbol[] = inputParser('XXX', validSymbols);
    expect(result.length).toEqual(3);
    expect([result[0].label, result[1].label, result[2].label]).toEqual(['X', 'X', 'X']);
  });
  
  test('inputParser reads input of length 4 repeated 4 times FAIL', () => {
    function inputParserFunc() {
      inputParser('XXXX', validSymbols);
    }
    expect(inputParserFunc).toThrow(InvalidSyntaxError);
    expect(inputParserFunc).toThrow(`Symbol 'X' at index 3 cannot be repeated 4 times`);
  });
  
  test('inputParser reads input where subtraction is not allowed', () => {
    function inputParserFunc() {
      inputParser('VX', validSymbols);
    }
    expect(inputParserFunc).toThrow(InvalidSyntaxError);
    expect(inputParserFunc).toThrow(`Symbol 'V' cannot be subtracted from 'X'`);
  });
  
  test('inputParser reads II, OK', () => {
    let result: Symbol[] = inputParser('II', validSymbols);
    expect(result.length).toEqual(2);
    expect([result[0].label, result[1].label]).toEqual(['I', 'I']);
  });
  
  test('inputParser reads IV, OK', () => {
    let result: Symbol[] = inputParser('IV', validSymbols);
    expect(result.length).toEqual(2);
    expect([result[0].label, result[1].label]).toEqual(['I', 'V']);
  });
  
  test('inputParser reads XXXIX, OK', () => {
    let result: Symbol[] = inputParser('XXXIX', validSymbols);
    expect(result.length).toEqual(5);
    expect([result[0].label, result[1].label, result[2].label, result[3].label, result[4].label]).toEqual(['X', 'X', 'X', 'I', 'X']);
  });
  
  test('inputParser reads input where subtraction is not allowed', () => {
    function inputParserFunc() {
      inputParser('VX', validSymbols);
    }
    expect(inputParserFunc).toThrow(InvalidSyntaxError);
    expect(inputParserFunc).toThrow(`Symbol 'V' cannot be subtracted from 'X'`);
  });
  
  test('inputParser reads IIV and throws error', () => {
    function inputParserFunc() {
      inputParser('IIV', validSymbols);
    }
    expect(inputParserFunc).toThrow(InvalidSyntaxError);
    expect(inputParserFunc).toThrow(`Symbol 'I' at index 0 cannot subtract twice`);
  });
  
})

describe('Calculation functions test suite', () => {
  test('calculateAmountFromSymbols input II', () => {
    let testInput = [new Symbol('I', 1, 3), new Symbol('I', 1, 3)];
    expect(calculateAmountFromSymbols(testInput)).toEqual(2);
  });
  
  test('calculateAmountFromSymbols input VI', () => {
    let testInput = [new Symbol('V', 5, 1, 'I'), new Symbol('I', 1, 3)];
    expect(calculateAmountFromSymbols(testInput)).toEqual(6);
  });
  
  test('calculateAmountFromSymbols input IV', () => {
    let testInput = [new Symbol('I', 1, 3), new Symbol('V', 5, 1)];
    expect(calculateAmountFromSymbols(testInput)).toEqual(4);
  });
  
  test('calculateAmountFromSymbols input XIV', () => {
    let testInput = [new Symbol('X', 10, 3), new Symbol('I', 1, 3), new Symbol('V', 5, 1)];
    expect(calculateAmountFromSymbols(testInput)).toEqual(14);
  });
  
  test('calculateAmountFromSymbols input XIX', () => {
    let testInput = [new Symbol('X', 10, 3), new Symbol('I', 1, 3), new Symbol('X', 10, 3)];
    expect(calculateAmountFromSymbols(testInput)).toEqual(19);
  });
});

describe('Full calculations test suite', () => {
  test('Calculate empty input', () => {
    function calculateAmountFunc() {
      calculateAmount('', validSymbols);
    }
    expect(calculateAmountFunc).toThrow(EmptyValueError);
    expect(calculateAmountFunc).toThrow(`ValueToParse cannot be empty`);
  });
  
  test('Calculate unrecognised input MCF', () => {
    function calculateAmountFunc() {
      calculateAmount('MCF', validSymbols);
    }
    expect(calculateAmountFunc).toThrow(InvalidValueError);
    expect(calculateAmountFunc).toThrow(`Symbol: 'F' at index 2 is not recognised`);
  });
  
  test('Calculate too many repetitions input IIII', () => {
    function calculateAmountFunc() {
      calculateAmount('IIII', validSymbols);
    }
    expect(calculateAmountFunc).toThrow(InvalidSyntaxError);
    expect(calculateAmountFunc).toThrow(`Symbol 'I' at index 3 cannot be repeated 4 times`);
  });
  
  test('Calculate not subtractable input VX', () => {
    function calculateAmountFunc() {
      calculateAmount('VX', validSymbols);
    }
    expect(calculateAmountFunc).toThrow(InvalidSyntaxError);
    expect(calculateAmountFunc).toThrow(`Symbol 'V' cannot be subtracted from 'X'`);
  });
  
  test('Calculate many subtractions input IIX', () => {
    function calculateAmountFunc() {
      calculateAmount('IIX', validSymbols);
    }
    expect(calculateAmountFunc).toThrow(InvalidSyntaxError);
    expect(calculateAmountFunc).toThrow(`Symbol 'I' at index 0 cannot subtract twice`);
  });
  
  test('Calculate XXX', () => {
    expect(calculateAmount('XXX', validSymbols)).toEqual(30);
  });
  
  test('Calculate XIV', () => {
    expect(calculateAmount('XXX', validSymbols)).toEqual(30);
  });
  
  test('Calculate XIV', () => {
    expect(calculateAmount('XXX', validSymbols)).toEqual(30);
  });
  
  test('Calculate MMVI', () => {
    expect(calculateAmount('MMVI', validSymbols)).toEqual(2006);
  });
  
  test('Calculate MCMXLIV', () => {
    expect(calculateAmount('MCMXLIV', validSymbols)).toEqual(1944);
  });
})