export class Notes {
  symbolsMap: Map<string, string>;
  infoElemMap: Map<string, string[]>;
  translationList?: Array<string[]>;
  conversionMap?: Array<[string, string[]]>;
  constructor(symbolsMap: Map<string, string>, infoElemMap: Map<string, string[]>,
              translationList: Array<string[]>, conversionMap: Array<[string, string[]]>) {
    this.symbolsMap = symbolsMap;
    this.infoElemMap = infoElemMap;
    this.translationList = translationList;
    this.conversionMap = conversionMap;
  }
}