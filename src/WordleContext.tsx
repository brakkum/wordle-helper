import {createContext, useContext, useEffect, useState} from 'react';
import {Word} from './Word';
import {Guess} from './Guess';
import {all_words, wordle_words} from './raw_words';
import {v4 as uuidv4} from 'uuid';
import {only5Chars} from './tools';
import {LetterStatus} from './LetterStatus';
import {WordBank} from "./WordBank";
import {useLocalStorage} from "react-use";

const WordleContext = createContext({} as WordleContextValues);

export interface WordleContextValues {
  words: Word[]
  setWords: (w: Word[]) => void
  restart: () => void
  guesses: Guess[]
  setGuesses: (g: Guess[]) => void
  addGuess: () => void
  addGuessWord: (w: string) => void
  removeGuess: (id: string) => void
  updateGuessWord: (id: string, word: string) => void
  updateGuessStatus: (id: string, status: LetterStatus[]) => void
  possibleWords: Word[]
  wordBank: WordBank | undefined
  setWordBank: (wb: WordBank) => void
  numPossibleWords: number
}

const WordleProvider = ({children}: { children: React.ReactElement }) => {

  const [words, setWords] = useState<Word[]>([]);
  const [guesses, setGuesses] = useState<Guess[]>([new Guess(uuidv4())]);
  const [wordBank, setWordBank] = useLocalStorage<WordBank>('word-bank', 'wordle');

  //#useEffects
  useEffect(() => {
    let rawWords: string[] = []
    if (wordBank === 'wordle') {
      rawWords = wordle_words;
    } else if (wordBank === 'all') {
      rawWords = all_words;
    }
    const w: Word[] = [];
    rawWords.forEach(rw => {
      w.push(new Word(rw));
    });
    setWords(w);
  }, [wordBank]);

  // use if need particular state to debug
  // useEffect(() => {
  //   let g = new Guess(uuidv4());
  //   g.updateWord('grant');
  //   g.setStatus(['has', '', '', '', '']);
  //   setGuesses([g]);
  // }, []);
  //#endregion

  //#region functions
  const addGuess = () => {
    setGuesses([
      ...guesses,
      new Guess(uuidv4()),
    ]);
  };

  const addGuessWord = (word: string) => {
    const guess = new Guess(uuidv4());
    guess.updateWord(word);
    guess.setStatus(['', '', '', '', '']);
    if (guesses.length === 1 && guesses[0].word === '') {
      setGuesses([
        guess,
      ]);
    } else {
      setGuesses([
        ...guesses,
        guess,
      ]);
    }
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

  const restart = () => {
    setGuesses([new Guess(uuidv4())]);
  }
  //#endregion

  //#region calculate possible words
  let possibleWords = words.filter(word => word.matchesGuesses(guesses));
  //#endregion

  const numPossibleWords = possibleWords.length;

  const contextItems: WordleContextValues = {
    words,
    setWords,
    restart,
    guesses,
    setGuesses,
    addGuess,
    addGuessWord,
    removeGuess,
    updateGuessWord,
    updateGuessStatus,
    wordBank,
    setWordBank,
    possibleWords,
    numPossibleWords,
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

