import {Symbol} from "../entities/Symbol"
import {EmptyValueError} from "../ErrorHandling/EmptyValueError";
import {InvalidValueError} from "../ErrorHandling/InvalidValueError";
import * as fs from "fs"
import {SymbolTable} from "../interfaces/SymbolTable";
import {InvalidSyntaxError} from "../ErrorHandling/InvalidSyntaxError";

export function generateSymbol(label: string, value: number, maxNumberOfRepetitions: number, subtractedAllowedList?: string): Symbol {
  if (label.length === 0) throw new EmptyValueError('Label cannot be empty');
  if (value < 0) throw new InvalidValueError('Value cannot be negative');
  
  return new Symbol(label, value, maxNumberOfRepetitions, subtractedAllowedList);
}

export function getSymbolsFromFile(): SymbolTable<Symbol> {
  let symbolTable: SymbolTable<Symbol> = {};
  try {
    
    let lines: string[] = fs.readFileSync('src/utils/symbolTable.txt').toString().split("\n");
    
    for (const line of lines) {
      
      let elems = line.trim().split(' ');
      if (elems.length > 3) {
        symbolTable[elems[0]] = generateSymbol(elems[0], +elems[1], +elems[2], elems[3]);
      } else {
        symbolTable[elems[0]] = generateSymbol(elems[0], +elems[1], +elems[2]);
      }
      
    }
    
  } catch (e) {
    console.log(e);
  }
  return symbolTable;
}

export function inputParser(valueToParse: string, validSymbols: SymbolTable<Symbol>): Symbol[] {
  let parsedInput: Symbol[] = [];
  if (valueToParse.length === 0) throw new EmptyValueError('ValueToParse cannot be empty');
  let letters = valueToParse.split('');
  let numberOfRepetitions = 1;
  
  for (let i = 0; i < letters.length; i++) {
    let symbol = validSymbols[letters[i]];
    
    if (!symbol) throw new InvalidValueError(`Symbol: '${letters[i]}' at index ${i} is not recognised`);
    if (i - 2 >= 0 && symbol.value > parsedInput[i - 1].value && symbol.value > parsedInput[i - 2].value)
      throw new InvalidSyntaxError(`Symbol '${parsedInput[i - 2].label}' at index ${i - 2} cannot subtract twice`);
    
    if (i - 1 >= 0 && parsedInput[i - 1].label === symbol.label) {
      numberOfRepetitions++;
    } else {
      numberOfRepetitions = 1;
    }
    
    if (numberOfRepetitions > symbol.maxNumberOfRepetitions) throw new InvalidSyntaxError(`Symbol '${symbol.label}' at index ${i} cannot be repeated ${numberOfRepetitions} times`);
    
    if (i - 1 >= 0 && symbol.subtractedAllowed !== undefined && parsedInput[i - 1].value < symbol.value
      && parsedInput[i - 1].label !== symbol.subtractedAllowed) throw new InvalidSyntaxError(`Symbol '${parsedInput[i - 1].label}' cannot be subtracted from '${symbol.label}'`);
    parsedInput.push(symbol);
  }
  
  return parsedInput;
}

export function calculateAmountFromSymbols(input: Symbol[]): number {
  let result = 0;
  for (let i = 0; i < input.length; i++) {
    let current = input[i];
    let next = i + 1 < input.length ? input[i + 1] : null;
    if (next !== null && next.value > current.value) {
      result += next.value - current.value;
      i++;
    } else {
      result += input[i].value;
    }
    
  }
  return result;
}

export function calculateAmount(input: string, validSymbols: SymbolTable<Symbol>): number {
  return calculateAmountFromSymbols(inputParser(input, validSymbols));
}