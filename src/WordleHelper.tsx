import {raw_words} from "./raw_words";
import {useEffect, useState} from "react";
import {Word} from "./Word";
import {Box, Grid, TextField} from "@mui/material";
import {useWindowSize} from "./useWindowSize";
import {range} from 'lodash';

const possibleInfo = [
  '',
  'has',
  'is',
];

const resolveInfoToColor = (info: string) => {
  return {
    '': 'grey',
    'has': 'yellow',
    'is': 'green',
  }[info];
}

function WordleHelper() {

  const windowSize = useWindowSize();

  const [currentWord, setCurrentWord] = useState('');
  const [currentWordInfo, setCurrentWordInfo] = useState<string[]>(['', '', '', '', ''])
  const [words, setWords] = useState<Word[] | null>(null);

  useEffect(() => {
    const w: Word[] = [];
    raw_words.forEach(rw => {
      w.push(new Word(rw));
    });
    setWords(w);
  }, []);

  const setAndLimitWord = (w: string) => {
    w = w.toLowerCase();
    if (w.length > 5) {
      w = w.substring(0, 5);
    }
    setCurrentWord(w);
  };

  if (words === null) {
    return <div>one sec</div>
  }

  let possible = [...words];

  const indexesCertain: number[] = currentWordInfo.reduce<number[]>((arr, info, i) => {
    if (info === 'is') {
      return [...arr, i];
    }
    return arr;
  }, []);

  currentWordInfo.forEach((info, i) => {
    const otherIndexes = range(currentWordInfo.length).filter(k => k !== i);
    const otherUncertainIndexes = otherIndexes.filter(i => !indexesCertain.includes(i));
    switch (info) {
      case '': {
        possible = possible.filter(word => {
          return !word.contains(currentWord[i], otherUncertainIndexes);
        });
        break;
      }
      case 'has': {
        possible = possible.filter(word => {
          return word.contains(currentWord[i], otherUncertainIndexes) && !word.has(currentWord[i], i);
        });
        break;
      }
      case 'is': {
        possible = possible.filter(word => {
          return word.has(currentWord[i], i);
        });
        break;
      }
      default: {
        break;
      }
    }
  });

  return (
    <div style={{width: '100vw', height: '100vh'}}>
      <Grid container spacing={2} width={'100%'} height={'100%'} direction={windowSize.width && windowSize.width > 800 ? 'row' : 'column'}>
        <Grid item container xs={6} height='100%' direction='column' justifyContent='center' alignItems='center'>
          <TextField
            value={currentWord}
            placeholder={'what\'s your word?'}
            onChange={e => setAndLimitWord(e.target.value)}
          />
          <Grid container direction='row' justifyContent='center' alignItems='center'>
            {currentWordInfo.map((info, i) => {
              return <Box
                key={`box-${i}`}
                height='20px'
                width='20px'
                m='10px'
                border='1px solid grey'
                bgcolor={() => resolveInfoToColor(info)}
                style={{cursor: 'pointer'}}
                onClick={() => {
                  const currIndex = possibleInfo.indexOf(info);
                  const next = currIndex === possibleInfo.length - 1 ? 0 : currIndex + 1;

                  const c = [...currentWordInfo];
                  c[i] = possibleInfo[next];

                  setCurrentWordInfo(c);
                }}
              >
              </Box>
            })}
          </Grid>
        </Grid>
        <Grid item container xs={6} height='100%' overflow='scroll' pt='50px' justifyContent='center' alignItems='center'>
          {possible.map(word => {
            return <div style={{padding: '15px', textAlign: 'center', fontFamily: 'monospace', fontSize: '16px'}} key={word.toString()}>{word.toString()}</div>
          })}
        </Grid>
      </Grid>
    </div>
  );
}

export default WordleHelper;
