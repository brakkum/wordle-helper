import {Button, ButtonGroup} from "@mui/material";
import {useWindowSize} from "./useWindowSize";
import {useWordleContext} from './WordleContext';
import {GuessContainer} from './GuessContainer';

function WordleHelper() {

  const windowSize = useWindowSize();

  const {
    words,
    restart,
    guesses,
    wordBank,
    setWordBank,
    addGuessWord,
    possibleWords,
    numPossibleWords,
  } = useWordleContext();

  if (words.length === 0 || !windowSize.width || !windowSize.height || guesses.length === 0) {
    return <div>one sec</div>
  }

  return (
    <div className='helper-container'>
      <div className='guesses-container'>
        {wordBank !== undefined &&
          <ButtonGroup className='buttons'>
            <Button
              onClick={() => setWordBank('wordle')}
              style={{
                textDecoration: wordBank === 'wordle' ? 'underline' : 'none'
              }}
            >
              Wordle Words
            </Button>
            <Button
              onClick={() => setWordBank('all')}
              style={{
                textDecoration: wordBank === 'all' ? 'underline' : 'none'
              }}
            >
              All Words
            </Button>
            <Button
              onClick={restart}
              color='error'
            >
              Start Over
            </Button>
          </ButtonGroup>
        }
        {guesses.map(guess => <GuessContainer
            key={guess.id}
            guess={guess}
          />
        )}
        <p className='helper-hint'>
          (ps: you can click a word to make it your next guess)
        </p>
      </div>
      <div className='words-container'>
        <div className='words-list'>
          <div className='words-count-container'>
            <span className='words-count'>{numPossibleWords}</span>
          </div>
          {possibleWords.map(word => {
            return <div
              className='word'
              key={word.toString()}
              onClick={() => addGuessWord(word.toString())}
            >
              {word.toString()}
            </div>
          })}
        </div>
      </div>
    </div>
  );
}

export default WordleHelper;
