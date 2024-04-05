import browser, { Menus } from 'webextension-polyfill';
import { initApp } from './initApp';

type ContextMenus = 'search-word' | 'store-word';

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
  menus.forEach((menu) => {
    browser.contextMenus.create({
      id: menu.id,
      title: menu.title,
      contexts: menu.contexts,
    });
  });
});

chrome.contextMenus.onClicked.addListener(async (info) => {
  await initApp()
  if (info.menuItemId === 'search-word') {
    const url = `https://www.google.com/search?q=${info.selectionText}`;
    browser.tabs.create({ url });
  }
  if (info.menuItemId === 'store-word') {
    console.log(info.selectionText);
  }
});
