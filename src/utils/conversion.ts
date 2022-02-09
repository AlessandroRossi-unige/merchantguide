import {Notes} from "../entities/Notes";
import {Output} from "../entities/Output";
import {calculateAmount, getSymbolsFromFile} from "./symbols-parsing";
import {UnknownValueError} from "../ErrorHandling/UnknownValueError";
import {SymbolTable} from "../interfaces/SymbolTable";
import {Symbol} from "../entities/Symbol"
import fs from "fs";
import {EmptyValueError} from "../ErrorHandling/EmptyValueError";
import {InvalidValueError} from "../ErrorHandling/InvalidValueError";
import {InvalidSyntaxError} from "../ErrorHandling/InvalidSyntaxError";

export let GALACTIC_CURRENCY = 'Credits';


function convertFromAlien(alienSymbols: string[], symbolMap: Map<string, string>, validSymbols: SymbolTable<Symbol>): number {
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
  
  if (notes.translationList) {
    for (const translationRow of notes.translationList) {
      resTranslationList.push([translationRow, convertFromAlien(translationRow, notes.symbolsMap, validSymbols)]);
    }
  }
  if (notes.conversionMap) {
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
  }
  
  
  return new Output(resTranslationList, resConversionMap, ['err1']);
}

export function inputFromFile(path: string): Notes {
  let lines: string[] = fs.readFileSync(path).toString().split("\n");
  let alienSymbolsMap = new Map<string, string>();
  let translationList: Array<string[]> = [];
  let infoElemMap = new Map<string, string[]>();
  let conversionMap: Array<[string, string[]]> = [];
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) throw new EmptyValueError(`File ${path} is empty`);
    let words = lines[i].split(' ').filter(item => item.length>0).map(item => item.trim());
    if (words.length < 3) throw new InvalidSyntaxError(`Line ${i + 1}, input not long enough to be valid`);
    if (words[1] === 'is' && words.length === 3) {
      alienSymbolsMap.set(words[0], words[2]);
    } else if (words[words.length - 1] === GALACTIC_CURRENCY) {
      words.pop(); // remove 'Credits'
      let num = parseFloat(words.pop()!);
      if (isNaN(num) || num <= 0) throw new InvalidValueError(`Line ${i + 1}, not a valid amount of credits`); // must be a positive, valid number
      words.pop(); // remove 'is'
      let element = words.pop(); // get element name
      if (!element) throw new InvalidSyntaxError(`Line ${i + 1}, no label for element`);
      if (words && words.length > 0) {
        words.push(num.toString());
        infoElemMap.set(element, words)
      } else {
        throw new InvalidSyntaxError(`Line ${i + 1}, no amount for element '${element}'`)
      }
      
    } else if (words[words.length - 1] === '?') {
      if (words[0] !== 'how') throw new InvalidSyntaxError(`Line ${i + 1}, questions must begin with 'how'`);
      if (words [1] === 'much') {
        if (words.length < 5) throw new EmptyValueError(`Line ${i + 1}, question has no value to answer`);
        words.pop(); // remove ?
        translationList.push(words.slice(3));
      } else if (words[1] === 'many') {
        if (words.length < 7) throw new EmptyValueError(`Line ${i + 1}, question has no value to answer`);
        words.pop(); // remove ?
        let label = words.pop()!;
        let input = words.slice(4);
        conversionMap.push([label, input]);
      } else {
        throw new InvalidSyntaxError(`Line ${i + 1}, unrecognisable question`);
      }
    } else {
      throw new UnknownValueError(`Line ${i + 1} is unrecognised`);
    }
    
  }
  return new Notes(alienSymbolsMap, infoElemMap, translationList, conversionMap);
}

export function produceOutputIntoFile(inputPath: string, outputPath: string) {
  let output = produceOutputFromNotes(inputFromFile(inputPath));
  //fs.truncateSync(outputPath, 1);
  let outputFile = '';
  if (output.translationList && output.translationList.length !== 0) {
    let outputTranslations = output.translationList.map(outputElement => {
      return outputElement[0].join(' ') + ' is ' + outputElement[1];  // translations
    }).join('\n');
    outputFile += outputTranslations;
  }
  if (output.conversionMap && output.conversionMap.length !== 0) {
    if (outputFile !== '') outputFile += '\n';
    let outputConversions = output.conversionMap.map(outputElement => {
      return outputElement[1].join(' ') + ' ' + outputElement[0] + ' is ' + outputElement[2] + ' ' + GALACTIC_CURRENCY; // conversions
    }).join('\n');
    outputFile += outputConversions;
  }
  
  
  /*for (const outputElement of output.translationList) {
    outputFile += outputElement[0].join(' ') + ' is ' + outputElement[1]+ '\r\n';  // translations
  }
  
  for (const outputElement of output.conversionMap) {
    outputFile += outputElement[1].join(' ') + ' ' + outputElement[0] + ' is ' + outputElement[2] + ' ' + GALACTIC_CURRENCY + '\r\n'; // conversions
  }
  outputFile.replace(/\n$/, "");*/
  fs.writeFileSync(outputPath, outputFile, {flag: "w"});
}