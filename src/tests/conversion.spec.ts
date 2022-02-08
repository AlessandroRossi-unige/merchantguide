import {inputFromFile, produceOutputFromNotes, produceOutputIntoFile} from "../utils/conversion";
import {Notes} from "../entities/Notes";
import {UnknownValueError} from "../ErrorHandling/UnknownValueError";
import {EmptyValueError} from "../ErrorHandling/EmptyValueError";
import {InvalidSyntaxError} from "../ErrorHandling/InvalidSyntaxError";
import {InvalidValueError} from "../ErrorHandling/InvalidValueError";
import fs from "fs";

describe('Fetching input test suite', () => {
  test('Input is one translation of 3', () => {
    let notes: Notes;
    notes = new Notes(new Map<string, string>([['dxzc', 'I']]),
      new Map<string, string[]>([['Silver', ['dxzc', 'dxzc', '34']]]),
      [['dxzc', 'dxzc', 'dxzc']], [(['Silver', ['dxzc']])]);
    
    expect(produceOutputFromNotes(notes).translationList).toEqual([[['dxzc', 'dxzc', 'dxzc'], 3]]);
  });
  
  test('Input is one conversion of 1 Silver (34 cred value)', () => {
    let notes: Notes;
    notes = new Notes(new Map<string, string>([['dxzc', 'I']]),
      new Map<string, string[]>([['Silver', ['dxzc', 'dxzc', '34']]]),
      [['dxzc', 'dxzc', 'dxzc']], [(['Silver', ['dxzc']])]);
    
    expect(produceOutputFromNotes(notes).conversionMap).toEqual([['Silver', ['dxzc'], 17]]);
  });
  
  test('Input is one translation of 14 and one conversion of 17 Silver (36 cred value)', () => {
    let notes: Notes;
    notes = new Notes(new Map<string, string>([['dxzc', 'I'], ['pdlk', 'V'], ['vnvc', 'X']]),
      new Map<string, string[]>([['Silver', ['vnvc', 'pdlk', 'dxzc', 'dxzc', '36']]]),
      [['vnvc', 'dxzc', 'pdlk']], [(['Silver', ['vnvc', 'dxzc','dxzc', 'dxzc']])]);
    let output = produceOutputFromNotes(notes);
    expect(output.translationList).toEqual([[['vnvc', 'dxzc', 'pdlk'], 14]]);
    expect(output.conversionMap).toEqual([['Silver', ['vnvc', 'dxzc', 'dxzc', 'dxzc'], 27.53]]);
  });
  
  test('Input is one translation of 14 and one conversion of 17 Zinc (Not recognised)', () => {
    let notes: Notes;
    notes = new Notes(new Map<string, string>([['dxzc', 'I'], ['pdlk', 'V'], ['vnvc', 'X']]),
      new Map<string, string[]>([['Silver', ['vnvc', 'pdlk', 'dxzc', 'dxzc', '36']]]),
      [['vnvc', 'dxzc', 'pdlk']], [(['Zinc', ['vnvc', 'dxzc','dxzc', 'dxzc']])]);
    function generateSymbolFunc() {
      produceOutputFromNotes(notes);
    }
    expect(generateSymbolFunc).toThrow(UnknownValueError);
    expect(generateSymbolFunc).toThrow(`I don't have information on this: 'Zinc'`);
  });
  
  
})

describe('InputFromFile test suite', () => {
  test('Input from empty file, throws error EmptyValueError', () => {
    let path = 'src/tests/testfiles/empty.txt';
    function generateSymbolFunc() {
      inputFromFile(path);
    }
    expect(generateSymbolFunc).toThrow(EmptyValueError);
    expect(generateSymbolFunc).toThrow(`File ${path} is empty`);
  });
  
  test('Too few words, throws error', () => {
    let path = 'src/tests/testfiles/fewWords.txt';
    function generateSymbolFunc() {
      inputFromFile(path);
    }
    expect(generateSymbolFunc).toThrow(InvalidSyntaxError);
    expect(generateSymbolFunc).toThrow(`Line 1, input not long enough to be valid`);
  });
  
  test('Not valid amount of credits, throws error', () => {
    let path = 'src/tests/testfiles/invalidCreditsAmount.txt';
    function generateSymbolFunc() {
      inputFromFile(path);
    }
    expect(generateSymbolFunc).toThrow(InvalidValueError);
    expect(generateSymbolFunc).toThrow(`Line 1, not a valid amount of credits`);
  });
  
  test('No label for element, throws error', () => {
    let path = 'src/tests/testfiles/noLabel.txt';
    function generateSymbolFunc() {
      inputFromFile(path);
    }
    expect(generateSymbolFunc).toThrow(InvalidSyntaxError);
    expect(generateSymbolFunc).toThrow(`Line 1, no label for element`);
  });
  
  test('No values for element , throws error', () => {
    let path = 'src/tests/testfiles/noValue.txt';
    function generateSymbolFunc() {
      inputFromFile(path);
    }
    expect(generateSymbolFunc).toThrow(InvalidSyntaxError);
    expect(generateSymbolFunc).toThrow(`Line 1, no amount for element 'Zinc'`);
  });
  
  test('Question ends with ? but doesnt begin with how, throws error', () => {
    let path = 'src/tests/testfiles/noHow.txt';
    function generateSymbolFunc() {
      inputFromFile(path);
    }
    expect(generateSymbolFunc).toThrow(InvalidSyntaxError);
    expect(generateSymbolFunc).toThrow(`Line 1, questions must begin with 'how'`);
  });
  
  test('Question ends and starts properly but invalid second elem, throws error', () => {
    let path = 'src/tests/testfiles/invalidQuestion.txt';
    function generateSymbolFunc() {
      inputFromFile(path);
    }
    expect(generateSymbolFunc).toThrow(InvalidSyntaxError);
    expect(generateSymbolFunc).toThrow(`Line 1, unrecognisable question`);
  });
  
  test('Unrecognised input, throws error', () => {
    let path = 'src/tests/testfiles/unrecognised.txt';
    function generateSymbolFunc() {
      inputFromFile(path);
    }
    expect(generateSymbolFunc).toThrow(UnknownValueError);
    expect(generateSymbolFunc).toThrow(`Line 1 is unrecognised`);
  });
  
  test('Empty question (much), throws error', () => {
    let path = 'src/tests/testfiles/howMuchNoValue.txt';
    function generateSymbolFunc() {
      inputFromFile(path);
    }
    expect(generateSymbolFunc).toThrow(EmptyValueError);
    expect(generateSymbolFunc).toThrow(`Line 1, question has no value to answer`);
  });
  
  test('Empty question (many), throws error', () => {
    let path = 'src/tests/testfiles/howManyNoValue.txt';
    function generateSymbolFunc() {
      inputFromFile(path);
    }
    expect(generateSymbolFunc).toThrow(EmptyValueError);
    expect(generateSymbolFunc).toThrow(`Line 1, question has no value to answer`);
  });
  
  test('Input is valid and returns working map', () => {
    let path = 'src/tests/testfiles/validInput.txt';
    let notes: Notes;
    notes = new Notes(new Map<string, string>([['glob', 'I']]),
      new Map<string, string[]>([['Silver', ['glob', 'glob', '34']]]),
      [['pish', 'tegj', 'glob', 'glob']], [(['Silver', ['glob', 'prok']])]);
    
    expect(inputFromFile(path)).toEqual(notes);
  });
})

describe('produceOutput test suite', () => {
  test('valid', () => {
    let ipath = 'src/tests/testfiles/fullValidInput.txt';

    produceOutputIntoFile(ipath, 'src/tests/testOutput/pippo.txt');
    let output: string = fs.readFileSync('src/tests/testOutput/pippo.txt').toString();
    expect(output).toEqual('pish tegj glob glob is 42\r\nglob prok Silver is 68 Credits\r\nglob prok Gold is 57800 Credits\r\nglob prok Iron is 782 Credits');
  })
})