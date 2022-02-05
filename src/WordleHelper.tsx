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
    <Grid container spacing={2} direction='row' style={{width: windowSize.width, height: windowSize.height}}>
      {wordBank !== undefined &&
        <ButtonGroup
          style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
          }}
        >
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
      <Grid
        item
        container
        xs={6}
        direction='column'
        alignItems='center'
        flexWrap='nowrap'
        height='100vh'
        marginTop='50px'
        overflow='scroll'
      >
        {guesses.map(guess => <GuessContainer
            key={guess.id}
            guess={guess}
          />
        )}
      </Grid>
      <Grid
        item
        container
        xs={6}
        pt='50px'
        justifyContent='center'
        alignItems='center'
        height='100vh'
        overflow='scroll'
      >
        {possibleWords.map(word => {
          return <div style={{padding: '15px', textAlign: 'center', fontFamily: 'monospace', fontSize: '16px'}}
                      key={word.toString()}>{word.toString()}</div>
        })}
      </Grid>
    </Grid>
  );
}

export default WordleHelper;
