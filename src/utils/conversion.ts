import {Notes} from "../entities/Notes";
import {Output} from "../entities/Output";

export function produceOutputFromNotes(notes: Notes): Output {
  let output = new Output(notes.translationList, notes.conversionMap, ['err1']);
  return output

}