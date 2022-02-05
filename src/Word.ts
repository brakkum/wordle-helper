import {Guess} from './Guess';

export class Word {
  private readonly str: string;

  public constructor(word: string) {
    this.str = word;
  }

  public toString(): string {
    return this.str;
  }

  public has(char: string, index: number): boolean {
    return this.str[index] === char;
  }

  public contains(char: string, indexes: number[] = []) {
    if (indexes.length === 0) {
      return this.str.includes(char);
    }

    let contains = false;
    indexes.forEach(i => {
      if (this.str[i] === char) {
        contains = true;
      }
    });
    return contains;
  }

  public matchesGuesses(guesses: Guess[]): boolean {
    for (const guess of guesses) {
      if (!this.matchesGuess(guess)) {
        return false;
      }
    }
    return true;
  }

  public matchesGuess(guess: Guess): boolean {

    if (guess.word === this.str) {
      return false;
    }

    for (let i = 0; i < guess.wordStatus.length; i++) {
      const status = guess.wordStatus[i];
      if (status === 'is' && guess.word[i] !== this.str[i]) {
        return false;
      } else if (status === 'has' && guess.word[i] === this.str[i]) {
        return false;
      }
    }

    for (let letter in guess.possiblePositionLetters) {
      let hasLetter = false;
      for (let i = 0; i < guess.possiblePositionLetters[letter].length; i++) {
        const position = guess.possiblePositionLetters[letter][i];
        if (this.str[position] === letter) {
          hasLetter = true;
        }
      }
      if (!hasLetter) {
        return false;
      }
    }

    for (let letter in guess.neverPositionLetters) {
      if (guess.possiblePositionLetters[letter] !== undefined) {
        continue;
      }
      for (let i = 0; i < guess.neverPositionLetters[letter].length; i++) {
        const position = guess.neverPositionLetters[letter][i];
        if (this.str[position] === letter) {
          return false;
        }
      }
    }

    return true;
  }
}
