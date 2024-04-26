import { WordDefinition } from './type';

const truncateStringFromTargetWord =
  (targetWord: string, marginChars = 30) =>
  (sentence: string) => {
    const targetIndex = sentence.indexOf(targetWord);
    const startIndex = targetIndex - marginChars;
    const endIndex = targetIndex + targetWord.length + marginChars;
    const truncatedSentence = sentence.slice(startIndex, endIndex);
    if (startIndex > 0) {
      return `...${truncatedSentence}`;
    }
    if (endIndex < sentence.length) {
      return `${truncatedSentence}...`;
    }
    return truncatedSentence;
  };

export const Definition = ({
  word,
  meaning,
  examples,
  onClose,
}: WordDefinition & {
  x: number;
  y: number;
  onClose: () => void;
}) => {
  const truncate = truncateStringFromTargetWord(word);
  const handleClose = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onClose();
  };
  return (
    <div className="bg-white border  flex flex-col p-4 gap-4 h-full">
      <div className="absolute top-4 right-4">
        <button className="rounded-md w-4 h-4 inline-flex justify-center" onClick={handleClose}>
          x
        </button>
      </div>
      <h2>{word}</h2>
      <p className="font-sm">{meaning}</p>
      <ul className="font-sm">
        {examples.map(({ sentence, url }) => (
          <li key={sentence}>
            <a href={url} target="_blank" rel="noreferrer">
              {truncate(sentence)}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};
