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
      [['vnvc', 'dxzc', 'pdlk']], [(['Silver', ['vnvc', 'dxzc', 'dxzc', 'dxzc']])]);
    let output = produceOutputFromNotes(notes);
    expect(output.translationList).toEqual([[['vnvc', 'dxzc', 'pdlk'], 14]]);
    expect(output.conversionMap).toEqual([['Silver', ['vnvc', 'dxzc', 'dxzc', 'dxzc'], 27.53]]);
  });
  
  test('Input is one translation of 14 and one conversion of 17 Zinc (Not recognised)', () => {
    let notes: Notes;
    notes = new Notes(new Map<string, string>([['dxzc', 'I'], ['pdlk', 'V'], ['vnvc', 'X']]),
      new Map<string, string[]>([['Silver', ['vnvc', 'pdlk', 'dxzc', 'dxzc', '36']]]),
      [['vnvc', 'dxzc', 'pdlk']], [(['Zinc', ['vnvc', 'dxzc', 'dxzc', 'dxzc']])]);
    
    function generateSymbolFunc() {
      produceOutputFromNotes(notes);
    }
    
    expect(generateSymbolFunc).toThrow(UnknownValueError);
    expect(generateSymbolFunc).toThrow(`I don't have information on this: 'Zinc'`);
  });
  
  
})

describe('InputFromFile test suite', () => {
  test('Input from empty file, throws error EmptyValueError', () => {
    let path = 'src/tests/testfiles/failing/empty.txt';
    
    function generateSymbolFunc() {
      inputFromFile(path);
    }
    
    expect(generateSymbolFunc).toThrow(EmptyValueError);
    expect(generateSymbolFunc).toThrow(`File ${path} is empty`);
  });
  
  test('Too few words, throws error', () => {
    let path = 'src/tests/testfiles/failing/fewWords.txt';
    
    function generateSymbolFunc() {
      inputFromFile(path);
    }
    
    expect(generateSymbolFunc).toThrow(InvalidSyntaxError);
    expect(generateSymbolFunc).toThrow(`Line 1, input not long enough to be valid`);
  });
  
  test('Not valid amount of credits, throws error', () => {
    let path = 'src/tests/testfiles/failing/invalidCreditsAmount.txt';
    
    function generateSymbolFunc() {
      inputFromFile(path);
    }
    
    expect(generateSymbolFunc).toThrow(InvalidValueError);
    expect(generateSymbolFunc).toThrow(`Line 1, not a valid amount of credits`);
  });
  
  test('No label for element, throws error', () => {
    let path = 'src/tests/testfiles/failing/noLabel.txt';
    
    function generateSymbolFunc() {
      inputFromFile(path);
    }
    
    expect(generateSymbolFunc).toThrow(InvalidSyntaxError);
    expect(generateSymbolFunc).toThrow(`Line 1, no label for element`);
  });
  
  test('No values for element , throws error', () => {
    let path = 'src/tests/testfiles/failing/noValue.txt';
    
    function generateSymbolFunc() {
      inputFromFile(path);
    }
    
    expect(generateSymbolFunc).toThrow(InvalidSyntaxError);
    expect(generateSymbolFunc).toThrow(`Line 1, no amount for element 'Zinc'`);
  });
  
  test('Question ends with ? but doesnt begin with how, throws error', () => {
    let path = 'src/tests/testfiles/failing/noHow.txt';
    
    function generateSymbolFunc() {
      inputFromFile(path);
    }
    
    expect(generateSymbolFunc).toThrow(InvalidSyntaxError);
    expect(generateSymbolFunc).toThrow(`Line 1, questions must begin with 'how'`);
  });
  
  test('Question ends and starts properly but invalid second elem, throws error', () => {
    let path = 'src/tests/testfiles/failing/invalidQuestion.txt';
    
    function generateSymbolFunc() {
      inputFromFile(path);
    }
    
    expect(generateSymbolFunc).toThrow(InvalidSyntaxError);
    expect(generateSymbolFunc).toThrow(`Line 1, unrecognisable question`);
  });
  
  test('Unrecognised input, throws error', () => {
    let path = 'src/tests/testfiles/failing/unrecognised.txt';
    
    function generateSymbolFunc() {
      inputFromFile(path);
    }
    
    expect(generateSymbolFunc).toThrow(UnknownValueError);
    expect(generateSymbolFunc).toThrow(`Line 1 is unrecognised`);
  });
  
  test('Empty question (much), throws error', () => {
    let path = 'src/tests/testfiles/failing/howMuchNoValue.txt';
    
    function generateSymbolFunc() {
      inputFromFile(path);
    }
    
    expect(generateSymbolFunc).toThrow(EmptyValueError);
    expect(generateSymbolFunc).toThrow(`Line 1, question has no value to answer`);
  });
  
  test('Empty question (many), throws error', () => {
    let path = 'src/tests/testfiles/failing/howManyNoValue.txt';
    
    function generateSymbolFunc() {
      inputFromFile(path);
    }
    
    expect(generateSymbolFunc).toThrow(EmptyValueError);
    expect(generateSymbolFunc).toThrow(`Line 1, question has no value to answer`);
  });
  
  test('Input is valid and returns working map', () => {
    let path = 'src/tests/testfiles/passing/validInput.txt';
    let notes: Notes;
    notes = new Notes(new Map<string, string>([['glob', 'I']]),
      new Map<string, string[]>([['Silver', ['glob', 'glob', '34']]]),
      [['pish', 'tegj', 'glob', 'glob']], [(['Silver', ['glob', 'prok']])]);
    
    expect(inputFromFile(path)).toEqual(notes);
  });
})

describe('produceOutput test suite', () => {
  test('Valid full input', () => {
    let ipath = 'src/tests/testfiles/passing/fullValidInput.txt';
    let opath = 'src/tests/testOutput/output.txt';
    produceOutputIntoFile(ipath, opath);
    let output: string = fs.readFileSync(opath).toString();
    expect(output).toEqual('pish tegj glob glob is 42\nglob prok Silver is 68 Credits\nglob prok Gold is 57800 Credits\nglob prok Iron is 782 Credits');
  });
  
  test('Valid only translations', () => {
    let ipath = 'src/tests/testfiles/passing/onlyTranslation.txt';
    let opath = 'src/tests/testOutput/output.txt';
    produceOutputIntoFile(ipath, opath);
    let output: string = fs.readFileSync(opath).toString();
    expect(output).toEqual('pish pish pish glob pish is 39');
  });
  
  test('Valid only conversions', () => {
    let ipath = 'src/tests/testfiles/passing/onlyConversion.txt';
    let opath = 'src/tests/testOutput/output.txt';
    produceOutputIntoFile(ipath, opath);
    let output: string = fs.readFileSync(opath).toString();
    expect(output).toEqual('glob prok Gold is 57800 Credits');
  });
  
  test('Valid no questions', () => {
    let ipath = 'src/tests/testfiles/passing/noQuestions.txt';
    let opath = 'src/tests/testOutput/output.txt';
    produceOutputIntoFile(ipath, opath);
    let output: string = fs.readFileSync(opath).toString();
    expect(output).toEqual('');
  });
  
  test('Extra spaces, throws error', () => {
    let ipath = 'src/tests/testfiles/failing/extraSpaces.txt';
    let opath = 'src/tests/testOutput/output.txt';
    produceOutputIntoFile(ipath, opath);
    let output: string = fs.readFileSync(opath).toString();
    expect(output).toEqual('pish tegj glob glob is 42\nglob prok Silver is 68 Credits\nglob prok Gold is 57800 Credits\nglob prok Iron is 782 Credits');
  });
})