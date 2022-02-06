import { Symbol } from "../entities/Symbol"
import {EmptyValueError} from "../ErrorHandling/EmptyValueError";
import { InvalidValueError } from "../ErrorHandling/InvalidValueError";
import * as fs from "fs"
import {SymbolTable} from "../interfaces/SymbolTable";

export function generateSymbol(label: string, value: number) : Symbol {
  if (label.length === 0) {
    throw new EmptyValueError('Label cannot be empty');
  }
  if (value < 0 ) {
    throw new InvalidValueError('Value cannot be negative');
  }
  return new Symbol(label, value);
}

export function getSymbolsFromFile(): Symbol[] {
  let symbolList: Symbol[] = [];
  try {
  
    let lines: string[] = fs.readFileSync('D:\\nodejs\\merchantguide\\src\\utils\\symbolTable.txt').toString().split("\n");
  
    for (const line of lines) {
      let elems = line.split(' ');
      symbolList.push(generateSymbol(elems[0], +elems[1]));
    }
    
  } catch (e) {
    console.log(e);
  }
  console.log(symbolList);
  return symbolList;
}

export function inputParser(valueToParse: string, validSymbols: SymbolTable<Symbol>) : Symbol[] {
  let parsedInput: Symbol[] = [];
  if (valueToParse.length === 0) throw new EmptyValueError('ValueToParse cannot be empty');
  let letters = valueToParse.split('');
  for (const letter of letters) {
    let symbol = validSymbols[letter];
    if (!symbol) throw new InvalidValueError(`Symbol: '${letter}' is not recognised`);
    parsedInput.push(symbol);
  }
  return parsedInput;
}