import {raw_words} from "./raw_words";
import {useEffect, useState} from "react";
import {Word} from "./Word";
import {Box, Grid, TextField} from "@mui/material";
import {useWindowSize} from "./useWindowSize";
import {range} from 'lodash';
import {Guess} from './Guess';
import {useWordleContext} from './WordleContext';
import {GuessContainer} from './GuessContainer';

function WordleHelper() {

  const windowSize = useWindowSize();

  const {
    words,
    guesses,
    possibleWords,
  } = useWordleContext();

  if (words.length === 0 || !windowSize.width || !windowSize.height || guesses.length === 0) {
    return <div>one sec</div>
  }

  return (
    <div style={{width: windowSize.width, height: windowSize.height}}>
      <Grid container spacing={2} width={'100%'} height={'100%'} direction='row'>
        <Grid item container xs={6} height='100%' direction='column' justifyContent='center' alignItems='center'>
          {guesses.map(guess => <GuessContainer
              key={guess.id}
              guess={guess}
            />
          )}
        </Grid>
        <Grid item container xs={6} height='100%' overflow='scroll' pt='50px' justifyContent='center' alignItems='center'>
          {possibleWords.map(word => {
            return <div style={{padding: '15px', textAlign: 'center', fontFamily: 'monospace', fontSize: '16px'}} key={word.toString()}>{word.toString()}</div>
          })}
        </Grid>
      </Grid>
    </div>
  );
}

export default WordleHelper;
