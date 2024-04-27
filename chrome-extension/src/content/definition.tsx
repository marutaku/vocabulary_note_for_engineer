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
const formatMeaning = (rawMeaning: string) => {
  const meanings = rawMeaning.split('\n');
  return (
    <div className="flex flex-col gap-1">
      {meanings.map((meaning) => (
        <div key={meaning}>{meaning}</div>
      ))}
    </div>
  );
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
    <div className="bg-white border rounded-sm flex flex-col p-4 gap-2 max-h-[450px] overflow-x-scroll w-[400px]">
      <div className="absolute top-4 right-4">
        <button className="rounded-md w-4 h-4 inline-flex justify-center" onClick={handleClose}>
          x
        </button>
      </div>
      <h2>{word}</h2>
      <div>
        <h4 className="font-lg">意味</h4>
        <div className="font-sm">{formatMeaning(meaning)}</div>
      </div>
      <div>
        <h4 className="font-lg">例文</h4>
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
    </div>
  );
};
