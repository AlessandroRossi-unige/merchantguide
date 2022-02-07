export class Output {
  translationList: Array<string[]>;
  conversionMap: Array<Map<string, string[]>>;
  errorList: string[];
  constructor(translationList: Array<string[]>, convertionMap: Array<Map<string, string[]>>, errorList: string[]) {
    this.translationList = translationList;
    this.conversionMap = convertionMap;
    this.errorList = errorList;
  }
}