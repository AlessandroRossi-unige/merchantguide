import {Notes} from "../entities/Notes";
import {Output} from "../entities/Output";
import {calculateAmount, getSymbolsFromFile} from "./symbols-parsing";
import {UnknownValueError} from "../ErrorHandling/UnknownValueError";
import {SymbolTable} from "../interfaces/SymbolTable";
import { Symbol } from "../entities/Symbol"
import fs from "fs";
import {EmptyValueError} from "../ErrorHandling/EmptyValueError";
import {InvalidValueError} from "../ErrorHandling/InvalidValueError";
import {InvalidSyntaxError} from "../ErrorHandling/InvalidSyntaxError";

export let GALACTIC_CURRENCY = 'Credits';


function convertFromAlien(alienSymbols: string[], symbolMap :Map<string, string>, validSymbols: SymbolTable<Symbol>): number {
  let romanSymbols = '';
  for (const alienSymbol of alienSymbols) {
    romanSymbols += symbolMap.get(alienSymbol);
  }
  return calculateAmount(romanSymbols, validSymbols);
}

export function produceOutputFromNotes(notes: Notes): Output {
  let validSymbols = getSymbolsFromFile();
  let resTranslationList: Array<[string[], number]> = [];
  let resConversionMap: Array<[string, string[], number]> = [];
  
  for (const translationRow of notes.translationList) {
    resTranslationList.push([translationRow, convertFromAlien(translationRow, notes.symbolsMap, validSymbols)]);
  }
  
  for (const conversionRow of notes.conversionMap) {
    let valueOfElement = notes.infoElemMap.get(conversionRow[0]);
    let numericValue = 0;
    if (!valueOfElement) throw new UnknownValueError(`I don't have information on this: '${conversionRow[0]}'`);
    let val = valueOfElement.pop()
    if (val !== undefined) {
      numericValue = +val;
    }
    
    let amount = convertFromAlien(valueOfElement, notes.symbolsMap, validSymbols);
    let valueOfOneUnit = numericValue / amount;
    
    let amountToCalculate = +(convertFromAlien(conversionRow[1], notes.symbolsMap, validSymbols) * valueOfOneUnit).toFixed(2);
    resConversionMap.push([conversionRow[0], conversionRow[1], amountToCalculate]);
  }
  
  return new Output(resTranslationList, resConversionMap, ['err1']);
}

export function inputFromFile(path: string): Notes {
  let lines: string[] = fs.readFileSync(path).toString().split("\n");
  let alienSymbolsMap = new Map<string, string>();
  let translationList: string[][] = [[]];
  let infoElemMap =  new Map<string, string[]>();
  
  for (let i = 0; i <lines.length; i++) {
    if (lines[i].length === 0) throw new EmptyValueError(`File ${path} is empty`);
    let words = lines[i].split(' ');
    if (words.length < 3) throw new InvalidSyntaxError(`Line ${i+1}, input not long enough to be valid`);
    if (words[1] === 'is') {
      alienSymbolsMap.set(words[0], words[2]);
    } else if (words[words.length-1] === GALACTIC_CURRENCY) {
      words.pop(); // remove 'Credits'
      let num = parseFloat( words.pop()!);
      if (isNaN(num) || num <= 0) throw new InvalidValueError(`Line ${i+1}, not a valid amount of credits`); // must be a positive, valid number
      words.pop(); // remove 'is'
      let element = words.pop(); // get element name
      if (!element) throw new InvalidSyntaxError(`Line ${i+1}, no label for element`);
      if (words) {
        infoElemMap.set(element, words)
      } else {
        throw new InvalidSyntaxError(`Line ${i+1}, no amount for element '${element}'`)
      }
      
    }
    
  }
  return new Notes(alienSymbolsMap, infoElemMap, translationList, [(['Silver', ['vnvc', 'dxzc','dxzc', 'dxzc']])]);
}