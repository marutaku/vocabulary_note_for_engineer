import { WordDefinition } from "./type";

export const searchWord = async (word: string) => {
  const result = await chrome.runtime.sendMessage({ type: 'search', word }) as WordDefinition;
  console.log('result:', result);
  return result;
};
