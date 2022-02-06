export class Symbol {
  label :string;
  value: number;
  maxNumberOfRepetitions: number;
  constructor(label: string, value: number, maxNumberOfRepetitions: number) {
    this.label = label;
    this.value = value;
    this.maxNumberOfRepetitions = maxNumberOfRepetitions;
  }
}