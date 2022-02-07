export class Output {
  translationList: Array<[string[], number]>;
  conversionMap: Array<[string, string[], number]>;
  errorList: string[];
  constructor(translationList: Array<[string[], number]>, conversionMap: Array<[string, string[], number]>, errorList: string[]) {
    this.translationList = translationList;
    this.conversionMap = conversionMap;
    this.errorList = errorList;
  }
}