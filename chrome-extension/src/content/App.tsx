import { useEffect, useState } from 'react';
import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { isSingleWord, isStringNotEmpty, trim } from './validate';
import { searchWord } from './search';
import { WordDefinition } from './type';
import { Definition } from './definition';

export const App = () => {
  const [showSearchButton, setShowSearchButton] = useState(false);
  const [word, setWord] = useState('');
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [wordDefinition, setWordDefinition] = useState<WordDefinition | undefined>();
  const resetSearchWord = () => {
    setWord('');
    setShowSearchButton(false);
  };
  const closeDefinition = () => {
    setWordDefinition(undefined);
    resetSearchWord();
    setPosition({ x: 0, y: 0 });
  };
  useEffect(() => {
    const bodyElement = document.querySelector('body');
    bodyElement?.addEventListener('mouseup', (e) => {
      e.preventDefault();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (e.target?.dataset.extensionArea) {
        return;
      }
      const selection = window.getSelection();
      console.log(selection?.toString());
      pipe(
        selection?.toString(),
        (s?: string) => E.fromNullable('empty')(s),
        E.chain(trim),
        E.chain(isStringNotEmpty),
        E.chain(isSingleWord),
        E.match(
          () => {
            resetSearchWord();
          },
          (selectedText: string) => {
            setWord(selectedText);
            setShowSearchButton(true);
            setPosition({ x: e.pageX, y: e.pageY });
          }
        )
      );
    });
  }, []);
  const handleSearch = async (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log('search', word);
    e.preventDefault();
    const result = await searchWord(word);
    setWordDefinition(result);
    resetSearchWord();
    window.getSelection()?.removeAllRanges();
  };
  if (showSearchButton) {
    return (
      <button
        className="bg-white border inline-flex items-center justify-center border-gray-300 rounded-md shadow-md z-50 w-8 h-8"
        style={{
          position: 'absolute',
          top: `${position.y + 10}px`,
          left: `${position.x}px`,
        }}
        onClick={handleSearch}
        data-extension-area="true"
      >
        S
      </button>
    );
  }
  if (wordDefinition) {
    return (
      <div
        className="border border-gray-300 rounded-sm shadow-md z-50 w-[400px] max-h-[450px]"
        style={{
          position: 'absolute',
          top: `${position.y + 10}px`,
          left: `${position.x}px`,
        }}
        data-extension-area="true"
      >
        <Definition {...wordDefinition} x={position.x} y={position.y} onClose={closeDefinition} />
      </div>
    );
  }
};

export default App;
