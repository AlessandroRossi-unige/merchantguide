export class Symbol {
  label :string;
  value: number;
  maxNumberOfRepetitions: number;
  subtractedAllowed?: string;
  constructor(label: string, value: number, maxNumberOfRepetitions: number, subtractedAllowed?: string) {
    this.label = label;
    this.value = value;
    this.maxNumberOfRepetitions = maxNumberOfRepetitions;
    this.subtractedAllowed = subtractedAllowed;
  }
}