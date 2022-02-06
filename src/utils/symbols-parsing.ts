import { Symbol } from "../entities/Symbol"
import {EmptyValueError} from "../ErrorHandling/EmptyValueError";
import { InvalidValueError } from "../ErrorHandling/InvalidValueError";
import * as fs from "fs"

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

export function inputParser(valueToParse: string) : string[] {
  if (valueToParse.length === 0) throw new EmptyValueError('ValueToParse cannot be empty');
  return ['null'];
}