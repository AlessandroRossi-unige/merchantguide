import {produceOutputFromNotes} from "../utils/conversion";
import {Notes} from "../entities/Notes";

describe('Fetching input test suite', () => {
  test('Input is one translation of 3', () => {
    let notes: Notes;
    notes = new Notes(new Map<string, string>([['dxzc', 'I']]),
      new Map<string, string[]>([['Silver', ['dxzc', 'dxzc', '34']]]),
      [['dxzc', 'dxzc', 'dxzc']], [new Map<string, string[]>([['Silver', ['dxzc']]])]);
    expect(produceOutputFromNotes(notes).translationList).toEqual([['dxzc', 'dxzc', 'dxzc', '3']])
  })
})