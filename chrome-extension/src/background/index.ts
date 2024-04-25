import browser, { Menus } from 'webextension-polyfill';
import { initApp } from './initApp';
import { APIClient } from './api';

type ContextMenus = 'search-word' | 'store-word';

const client = new APIClient();

const menus: { id: ContextMenus; title: string; contexts: Menus.ContextType[] }[] = [
  {
    id: 'search-word',
    title: '単語を検索する',
    contexts: ['selection'],
  },
  {
    id: 'store-word',
    title: '単語を保存する',
    contexts: ['selection'],
  },
];

// show welcome page on new install
browser.runtime.onInstalled.addListener(async () => {
  await initApp();
  menus.forEach((menu) => {
    browser.contextMenus.create({
      id: menu.id,
      title: menu.title,
      contexts: menu.contexts,
    });
  });
});

chrome.contextMenus.onClicked.addListener(async (info) => {
  if (info.menuItemId === 'search-word') {
    const word = info.selectionText;
    if (!word) {
      return;
    }
    const result = await client.searchWord(word);
    console.log(result);
  }
  if (info.menuItemId === 'store-word') {
    console.log(info.selectionText);
  }
});
type SearchRequestMessage = { type: 'search'; word: string };

chrome.runtime.onMessage.addListener((message: SearchRequestMessage, sender, sendResponse) => {
  if (message.type === 'search') {
    client.searchWord(message.word).then((result) => {
      sendResponse(result);
    });
  }
  return true;
});
