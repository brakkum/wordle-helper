import {LetterStatus} from './LetterStatus';

export class Guess {
  id: string;
  word: string = '';
  wordStatus: [LetterStatus, LetterStatus, LetterStatus, LetterStatus, LetterStatus] = ['', '', '', '', ''];
  definitePositionLetters: {[i: number]: string} = {};
  possiblePositionLetters: {[c: string]: number[]} = {};
  neverPositionLetters: {[c: string]: number[]} = {};

  public constructor(id: string, word: string = '') {
    this.id = id;
    this.word = word;
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
    let neverPositionLetters: {[c: string]: number[]} = {};

    for (let i = 0; i < 5; i++) {
      definitePositionLetters[i] = '';
    }

    this.wordStatus.forEach((status, index) => {
      if (status === 'is') {
        definitePositionLetters[index] = this.word[index];
      }
    });

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
      } else if (status === '') {
        if (neverPositionLetters[letter] === undefined) {
          neverPositionLetters[letter] = [];
        }
        for (let i = 0; i < 5; i++) {
          if (!definitePositionLetters[i]) {
            if (!neverPositionLetters[letter].includes(i)) {
              neverPositionLetters[letter].push(i);
            }
          }
        }
      }
    });

    this.definitePositionLetters = definitePositionLetters;
    this.possiblePositionLetters = possiblePositionLetters;
    this.neverPositionLetters = neverPositionLetters;
  }
}
