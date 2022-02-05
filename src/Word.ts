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
    return true;
  }
}
