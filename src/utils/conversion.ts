import {Notes} from "../entities/Notes";
import {Output} from "../entities/Output";
import {calculateAmount, getSymbolsFromFile} from "./symbols-parsing";

export function produceOutputFromNotes(notes: Notes): Output {
  let validSymbols = getSymbolsFromFile();
  let resTranslationList: Array<string[]> = [];
  let resConversionMap: Array<Map<string, string[]>> = [];
  for (const translationRow of notes.translationList) {
    let romanSymbols = '';
    for (const alienSymbol of translationRow) {
      romanSymbols += notes.symbolsMap.get(alienSymbol);
    }
    translationRow.push(calculateAmount(romanSymbols, validSymbols).toString())
    resTranslationList.push(translationRow);
  }
  
  return new Output(resTranslationList, notes.conversionMap, ['err1']);
}