import { flow } from 'lodash-es';
import * as E from 'fp-ts/Either';

export const trim = (s: string): E.Either<string, string> => {
  const trimmed = s.trim();
  return trimmed === '' ? E.left('empty') : E.right(trimmed);
};

export const isStringNotEmpty = E.fromPredicate(
  (s: string) => s !== '',
  () => 'empty'
);

export const isSingleWord = E.fromPredicate(
  (s: string) => s.split(' ').length === 1,
  () => 'not single word'
);
