import {Notes} from "../entities/Notes";
import {Output} from "../entities/Output";
import {calculateAmount, getSymbolsFromFile} from "./symbols-parsing";
import {UnknownValueError} from "../ErrorHandling/UnknownValueError";
import {SymbolTable} from "../interfaces/SymbolTable";
import { Symbol } from "../entities/Symbol"

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