import { Example } from './example';

export class Word {
  constructor(
    public surface: string,
    public meaning: string,
    public examples: Example[],
  ) {}
}
