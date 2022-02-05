import {LetterStatus} from './LetterStatus';

export const removeNonChars = (w: string) => {
  return w.replaceAll(/[\W\d]/g, '');
}

export const limitWord = (w: string, c: number) => {
  w = w.toLowerCase();
  if (w.length > c) {
    w = w.substring(0, c);
  }
  return w;
};

export const only5Chars = (w: string) => limitWord(removeNonChars(w), 5);

export const getAlphabet = (): string[] => {
  const alpha = Array.from(Array(26)).map((e, i) => i + 97);
  return alpha.map((x) => String.fromCharCode(x));
}

export const resolveInfoToColor = (info: string) => {
  return {
    '': 'grey',
    'has': 'yellow',
    'is': 'green',
  }[info];
}

export const possibleStatuses: LetterStatus[] = [
  '',
  'has',
  'is',
];
