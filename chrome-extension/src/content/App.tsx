import { useEffect, useState } from 'react';
import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { isSingleWord, isStringNotEmpty, trim } from './validate';
import { searchWord } from './search';

export const App = () => {
  const [showSearchButton, setShowSearchButton] = useState(false);
  const [word, setWord] = useState('');
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const resetSearchWord = () => {
    setWord('');
    setShowSearchButton(false);
    setPosition({ x: 0, y: 0 });
  };
  useEffect(() => {
    const bodyElement = document.querySelector('body');
    bodyElement?.addEventListener('mouseup', (e: MouseEvent) => {
      e.preventDefault();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (e.target?.dataset.extensionArea) {
        return;
      }
      const selection = window.getSelection();
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
            console.log(selectedText);
            setWord(selectedText);
            setShowSearchButton(true);
            setPosition({ x: e.pageX, y: e.pageY });
          }
        )
      );
    });
  }, []);
  const className = [
    'bg-white',
    'border',
    'inline-flex',
    'items-center',
    'justify-center',
    'border-gray-300',
    'rounded-md',
    'shadow-md',
    'z-50',
    'w-8',
    'h-8',
  ];
  const handleSearch = async (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log('search', word);
    e.preventDefault();
    const result = await searchWord(word);
    console.log(result);
    resetSearchWord();
  };
  return (
    showSearchButton && (
      <button
        className={className.join(' ')}
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
    )
  );
};

export default App;
