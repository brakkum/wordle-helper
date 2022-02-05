import {Guess} from './Guess';
import {Box, Button, Grid, TextField} from '@mui/material';
import {useWordleContext} from './WordleContext';
import {possibleStatuses, resolveInfoToColor} from './tools';

export const GuessContainer = ({guess}: {guess: Guess}) => {

  const {
    guesses,
    addGuess,
    removeGuess,
    updateGuessWord,
    updateGuessStatus,
  } = useWordleContext();

  const isLastGuess = guesses[guesses.length - 1].id === guess.id;

  return (
    <Grid m='10px'>
      <TextField
        value={guess.word}
        placeholder={'what\'s your word?'}
        onChange={e => updateGuessWord(guess.id, e.target.value)}
      />
      <Grid container direction='row' justifyContent='center' alignItems='center'>
        {guess.wordStatus.map((info, i) => {
          return <Box
            key={`box-${i}`}
            height='20px'
            width='20px'
            m='10px'
            border='1px solid grey'
            bgcolor={() => resolveInfoToColor(info)}
            style={{cursor: 'pointer'}}
            onClick={() => {
              const currIndex = possibleStatuses.indexOf(info);
              const next = currIndex === possibleStatuses.length - 1 ? 0 : currIndex + 1;

              const c = [...guess.wordStatus];
              c[i] = possibleStatuses[next];

              updateGuessStatus(guess.id, c);
            }}
          >
          </Box>
        })}
      </Grid>
      <div>
        <Button
          onClick={addGuess}
          disabled={!isLastGuess}
        >
          Add
        </Button>
        <Button
          disabled={guesses.length === 1}
          onClick={() => removeGuess(guess.id)}
        >
          Remove
        </Button>
      </div>
    </Grid>
  )
}
