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
    setGuesses([
      new Guess(uuidv4()),
    ]);
  }, []);
  //#endregion

  //#region functions
  const addGuess = () => {
    setGuesses([
      ...guesses,
      new Guess(uuidv4()),
    ]);
  };

  const removeGuess = (id: string) => {
    setGuesses([...guesses.filter(g => g.id !== id)]);
  };

  const updateGuessWord = (id: string, word: string) => {
    const gs = [...guesses];
    gs.forEach(g => {
      if (g.id === id) {
        g.updateWord(only5Chars(word));
      }
    })
    setGuesses([...gs]);
  }

  const updateGuessStatus = (id: string, status: LetterStatus[]) => {
    const gs = [...guesses];
    gs.forEach(g => {
      if (g.id === id) {
        // @ts-ignore - ignore error about length of status array
        g.setStatus(status);
      }
    });
    setGuesses([...gs]);
  }
  //#endregion

  //#region calculate possible words
  console.log(guesses)
  let possibleWords = words.filter(word => word.matchesGuesses(guesses));
  // console.log(possibleWords)
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

