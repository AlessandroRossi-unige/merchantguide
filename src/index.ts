import {produceOutputIntoFile} from "./utils/conversion";


try {
  console.log('READING input.txt');
  produceOutputIntoFile('input.txt', 'output.txt');
  console.log('FINISHED check output.txt');
} catch (e) {
  console.log(e);
}
