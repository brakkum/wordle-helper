import {LetterStatus} from './LetterStatus';

export interface Guess {
  id: string
  word: string
  wordStatus: [LetterStatus, LetterStatus, LetterStatus, LetterStatus, LetterStatus]
}
