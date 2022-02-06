import { Symbol } from "../entities/Symbol"
import {EmptyValueError} from "../ErrorHandling/EmptyValueError";
import { InvalidValueError } from "../ErrorHandling/InvalidValueError";
import * as fs from "fs"
import {SymbolTable} from "../interfaces/SymbolTable";
import {InvalidSyntaxError} from "../ErrorHandling/InvalidSyntaxError";

export function generateSymbol(label: string, value: number, maxNumberOfRepetitions: number, subtractedAllowedList?: string) : Symbol {
  if (label.length === 0) {
    throw new EmptyValueError('Label cannot be empty');
  }
  if (value < 0 ) {
    throw new InvalidValueError('Value cannot be negative');
  }
  return new Symbol(label, value, maxNumberOfRepetitions, subtractedAllowedList);
}

export function getSymbolsFromFile(): Symbol[] {
  let symbolList: Symbol[] = [];
  try {
  
    let lines: string[] = fs.readFileSync('D:\\nodejs\\merchantguide\\src\\utils\\symbolTable.txt').toString().split("\n");
  
    for (const line of lines) {
      
      let elems = line.trim().split(' ');
      if (elems.length > 3) {
        symbolList.push(generateSymbol(elems[0], +elems[1], +elems[2], elems[3]))
      } else {
        symbolList.push(generateSymbol(elems[0], +elems[1], +elems[2]));
      }
      
    }
    
  } catch (e) {
    console.log(e);
  }
  return symbolList;
}

export function inputParser(valueToParse: string, validSymbols: SymbolTable<Symbol>) : Symbol[] {
  let parsedInput: Symbol[] = [];
  if (valueToParse.length === 0) throw new EmptyValueError('ValueToParse cannot be empty');
  let letters = valueToParse.split('');
  let numberOfRepetitions = 1;
  for (let i=0; i <letters.length; i++) {
    let symbol = validSymbols[letters[i]];
    if (!symbol) throw new InvalidValueError(`Symbol: '${letters[i]}' at index ${i} is not recognised`);
    if (i-1 >= 0 && parsedInput[i-1].label === symbol.label) numberOfRepetitions++;
    if (numberOfRepetitions > symbol.maxNumberOfRepetitions) throw new InvalidSyntaxError(`Symbol '${symbol.label}' at index ${i} cannot be repeated ${numberOfRepetitions} times`);
    if (i-1 >=0 && symbol.subtractedAllowed !== undefined && parsedInput[i-1].value < symbol.value
      && parsedInput[i-1].label !== symbol.subtractedAllowed) throw new InvalidSyntaxError(`Symbol '${parsedInput[i-1].label}' cannot be subtracted from '${symbol.label}'`);
    parsedInput.push(symbol);
  }
  return parsedInput;
}