import {produceOutputFromNotes} from "../utils/conversion";
import {Notes} from "../entities/Notes";
import {UnknownValueError} from "../ErrorHandling/UnknownValueError";

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