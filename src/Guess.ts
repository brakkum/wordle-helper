import {LetterStatus} from './LetterStatus';

export class Guess {
  id: string;
  word: string = '';
  wordStatus: [LetterStatus, LetterStatus, LetterStatus, LetterStatus, LetterStatus] = ['', '', '', '', ''];
  definitePositionLetters: {[i: number]: string} = {};
  possiblePositionLetters: {[c: string]: number[]} = {};

  public constructor(id: string) {
    this.id = id;
  }

  public updateWord = (word: string) => {
    this.word = word;
    this.updateStatus();
  }

  public setStatus = (status: [LetterStatus, LetterStatus, LetterStatus, LetterStatus, LetterStatus]) => {
    this.wordStatus = status;
    this.updateStatus();
  }

  private updateStatus = () => {
    let definitePositionLetters: {[k: number]: string} = {};
    let possiblePositionLetters: {[l: string]: number[]} = {};

    for (let i = 0; i < 5; i++) {
      definitePositionLetters[i] = '';
    }

    this.wordStatus.forEach((status, i) => {
      if (status === 'is') {
        definitePositionLetters[i] = this.word[i];
      }
    }, []);

    this.wordStatus.forEach((status, letterIndex) => {
      const letter = this.word[letterIndex];

      if (status === 'has') {
        if (possiblePositionLetters[letter] === undefined) {
          possiblePositionLetters[letter] = [];
        }
        for (let i = 0; i < 5; i++) {
          if (definitePositionLetters[i]) {
            continue;
          } if (i !== letterIndex) {
            possiblePositionLetters[letter].push(i);
          }
        }
      }
    });

    this.definitePositionLetters = definitePositionLetters;
    this.possiblePositionLetters = possiblePositionLetters;
  }
}
