export const searchWord = async (word: string) => {
  const result = (await chrome.runtime.sendMessage({ type: 'search', word })) as {
    word: string;
    meaning: string;
    examples: {
      sentence: string;
      url: string;
    }[];
  };
  console.log('result:', result);
  return result;
};
