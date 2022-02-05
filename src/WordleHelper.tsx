import {Button, ButtonGroup, Grid} from "@mui/material";
import {useWindowSize} from "./useWindowSize";
import {useWordleContext} from './WordleContext';
import {GuessContainer} from './GuessContainer';

function WordleHelper() {

  const windowSize = useWindowSize();

  const {
    words,
    guesses,
    wordBank,
    setWordBank,
    possibleWords,
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
          </ButtonGroup>
        }
        {guesses.map(guess => <GuessContainer
            key={guess.id}
            guess={guess}
          />
        )}
      </div>
      <div className='words-container'>
        {possibleWords.map(word => {
          return <div style={{padding: '15px', textAlign: 'center', fontFamily: 'monospace', fontSize: '16px'}}
                      key={word.toString()}>{word.toString()}</div>
        })}
      </div>
    </div>
  );
}

export default WordleHelper;
