import { set } from 'lodash-es';
import { useEffect, useState } from 'react';

export const App = () => {
  const [showSearchButton, setShowSearchButton] = useState(false);
  const [searchWord, setSearchWord] = useState('');
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const resetSearchWord = () => {
    setSearchWord('');
    setShowSearchButton(false);
    setPosition({ x: 0, y: 0 });
  };
  useEffect(() => {
    const bodyElement = document.querySelector('body');
    bodyElement?.addEventListener('mouseup', (e: MouseEvent) => {
      e.preventDefault();
      const selection = window.getSelection();
      const selectedText = selection?.toString().trim();
      console.log(`onmouseup: ${selectedText}`);
      if (selectedText === undefined || selectedText === '') {
        resetSearchWord();
        return;
      }
      if (selectedText.split(' ').length > 1) {
        // 文章は検索対象外
        resetSearchWord();
        return;
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (e.target?.dataset.extensionArea) {
        // 文章は検索対象外
        resetSearchWord();
        return;
      }
      setSearchWord(selectedText);
      setShowSearchButton(true);
      setPosition({ x: e.pageX, y: e.pageY });
    });
  }, []);
  const className = [
    'bg-white',
    'border',
    'border-gray-300',
    'rounded-md',
    'shadow-md',
    'p-2',
    'z-50',
  ];
  return (
    <div>
      {showSearchButton && (
        <button
          className={className.join(' ')}
          style={{
            position: 'absolute',
            top: `${position.y + 10}px`,
            left: `${position.x}px`,
          }}
          onClick={() => {
            console.log(`search word: ${searchWord}`);
            resetSearchWord();
          }}
          data-extension-area="true"
        >
          S
        </button>
      )}
    </div>
  );
};

export default App;
