import isEmpty from 'lodash/isEmpty';

export async function getCurrentSession() {
  return new Promise((resolve) => {
    chrome.storage.local.get('current', (kv) => {
      if (isEmpty(kv)) resolve(null);
      resolve(kv.current);
    });
  });
}

export async function setCurrentSession(id) {
  return new Promise((resolve) => {
    chrome.storage.local.set({ current: id }, () => {
      resolve();
    });
  });
}

export async function getSessions() {
  return new Promise((resolve) => {
    chrome.storage.local.get('sessions', (kv) => {
      if (isEmpty(kv)) resolve({});
      resolve(kv.sessions);
    });
  });
}

export async function setSessions(data) {
  return new Promise((resolve) => {
    chrome.storage.local.set({ sessions: data }, () => {
      resolve();
    });
  });
}

export async function getTabs() {
  return new Promise((resolve) => {
    chrome.tabs.query({}, (tabs) => {
      resolve(tabs);
    });
  });
}

export async function getCurrentWindow() {
  return new Promise((resolve) => {
    chrome.windows.getCurrent((win) => {
      resolve(win);
    });
  });
}

export async function getAllWindows() {
  return new Promise((resolve) => {
    chrome.windows.getAll((windows) => {
      resolve(windows);
    });
  });
}

export async function createTab(data) {
  return new Promise((resolve) => {
    chrome.tabs.create(data, (tab) => {
      resolve(tab);
    });
  });
}

export async function createWindow() {
  return new Promise((resolve) => {
    chrome.windows.create((win) => {
      resolve(win);
    });
  });
}

export async function removeTabs(tabIds) {
  return new Promise((resolve) => {
    chrome.tabs.remove(tabIds, () => {
      resolve();
    });
  });
}

export function uniqueId() {
  return Math.random().toString(36).substring(2, 15);
}
