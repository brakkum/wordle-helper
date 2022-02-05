import {createContext, useContext, useEffect, useState} from 'react';
import {Word} from './Word';
import {Guess} from './Guess';
import {raw_words} from './raw_words';
import {v4 as uuidv4} from 'uuid';
import {range} from 'lodash';
import {getAlphabet, only5Chars} from './tools';
import {LetterStatus} from './LetterStatus';

const WordleContext = createContext({} as WordleContextValues);

export interface WordleContextValues {
  words: Word[]
  setWords: (w: Word[]) => void
  guesses: Guess[]
  setGuesses: (g: Guess[]) => void
  addGuess: () => void
  removeGuess: (id: string) => void
  updateGuessWord: (id: string, word: string) => void
  updateGuessStatus: (id: string, status: LetterStatus[]) => void
  possibleWords: Word[]
}

const WordleProvider = ({ children }: { children: React.ReactElement }) => {

  const [words, setWords] = useState<Word[]>([]);
  const [guesses, setGuesses] = useState<Guess[]>([]);

  //#region initial setup
  useEffect(() => {
    const w: Word[] = [];
    raw_words.forEach(rw => {
      w.push(new Word(rw));
    });
    setWords(w);
    setGuesses([{
      id: uuidv4(),
      word: '',
      wordStatus: ['', '', '', '', ''],
    }]);
  }, []);
  //#endregion

  //#region functions
  const addGuess = () => {
    setGuesses([
      ...guesses,
      {
        id: uuidv4(),
        word: '',
        wordStatus: ['', '', '', '', ''],
      }
    ]);
  };

  const removeGuess = (id: string) => {
    setGuesses([...guesses.filter(g => g.id !== id)]);
  };

  const updateGuessWord = (id: string, word: string) => {
    const gs = [...guesses];
    gs.forEach(g => {
      if (g.id === id) {
        g.word = only5Chars(word);
      }
    })
    setGuesses([...gs]);
  }

  const updateGuessStatus = (id: string, status: LetterStatus[]) => {
    const gs = [...guesses];
    gs.forEach(g => {
      if (g.id === id) {
        // @ts-ignore - ignore error about length of status array
        g.wordStatus = status;
      }
    });
    setGuesses([...gs]);
  }
  //#endregion

  //#region calculate possible words
  let definitePositionLetters: {[k: number]: string} = {};
  let possiblePositionLetters: {[l: string]: number[]} = {};

  for (let i = 0; i < 5; i++) {
    definitePositionLetters[i] = '';
  }

  guesses.forEach(guess => {
    guess.wordStatus.forEach((status, i) => {
      if (status === 'is') {
        definitePositionLetters[i] = guess.word[i];
      }
    }, []);
  });

  guesses.forEach(guess => {
    guess.wordStatus.forEach((status, letterIndex) => {
      const letter = guess.word[letterIndex];

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
  });

  console.log(definitePositionLetters)
  console.log(possiblePositionLetters)

  let possibleWords = words.filter(word => {
    const wordString = word.toString();
    for (let i = 0; i < 5; i++) {
      if (!definitePositionLetters[i]) {
        continue;
      }
      if (definitePositionLetters[i] !== wordString[i]) {
        return false
      }
    }

    let hasPossibleLettersMatch = true;
    Object.entries(possiblePositionLetters).forEach(([letter, indexes]) => {
      const hasLetterIndexMatch: boolean = indexes.reduce((hasMatch: boolean, currentIndex) => {
        if (hasMatch) return true;
        return wordString[currentIndex] === letter;
      }, false);
      if (!hasLetterIndexMatch) {
        hasPossibleLettersMatch = false;
      }
    });

    return hasPossibleLettersMatch;
  });
  console.log(possibleWords)
  //#endregion

  const contextItems: WordleContextValues = {
    words,
    setWords,
    guesses,
    setGuesses,
    addGuess,
    removeGuess,
    updateGuessWord,
    updateGuessStatus,
    possibleWords,
  }

  return <WordleContext.Provider value={contextItems}>
    {children}
  </WordleContext.Provider>
};

export {
  WordleProvider,
  WordleContext,
}

export const useWordleContext = () => useContext(WordleContext);

