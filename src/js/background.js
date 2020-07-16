import {
  createTab,
  createWindow,
  getAllWindows,
  getCurrentSession,
  getSessions,
  getTabs,
  removeTabs,
  setSessions
} from './util.js';

// Global synchronization variable that helps avoid race condition
const queue = [];

async function process() {
  const { type, data } = queue[0];
  const current = await getCurrentSession();
  if (!current) return queue.shift();
  const sessions = await getSessions();
  let tabs = sessions[current].tabs;

  switch (type) {
    case 'create':
      sessions[current].tabs.push(data);
      break;
    case 'update':
      for (let i = 0; i < tabs.length; i++) {
        if (tabs[i].id === data.tabId) tabs[i] = data.tab;
      }
      sessions[current].tabs = tabs;
      break;
    case 'remove':
      tabs = tabs.filter(tab => tab.id !== data);
      sessions[current].tabs = tabs;
      break;
  }
  await setSessions(sessions);
  queue.shift();
}

chrome.tabs.onCreated.addListener(async (tab) => {
  queue.push({ type: 'create', data: tab });
  if (queue.length > 1) return; // some other operation is in-flight
  while (queue.length > 0) await process();
});

chrome.tabs.onUpdated.addListener(async (tabId, change, tab) => {
  queue.push({ type: 'update', data: { tabId, change, tab }});
  if (queue.length > 1) return; // some other operation is in-flight
  while (queue.length > 0) await process();
});

chrome.tabs.onRemoved.addListener(async (tabId, removeInfo) => {
  queue.push({ type: 'remove', data: tabId });
  if (queue.length > 1) return; // some other operation is in-flight
  while (queue.length > 0) await process();
});

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.message === 'restore') {
    const [id, data] = request.data;

    // record existing tabs to be removed later
    const existing = await getTabs();
    const tabIds = existing.map(tab => tab.id);

    // update data store in case it's stale
    const sessions = await getSessions();
    sessions[id].tabs = existing;
    await setSessions(sessions);

    // create new windows as necessary and update old window IDs
    // so the tab gets added to the correct new window
    const winIds = (await getAllWindows()).map(win => win.id);
    for (let i = 0; i < data.tabs.length; i++) {
      if (winIds.indexOf(data.tabs[i].windowId) > -1) continue;
      const oldId = data.tabs[i].windowId;
      const win = await createWindow();
      winIds.push(win.id);
      if (win.tabs.length > 0) tabIds.push(win.tabs[0].id); // placeholder tab
      for (let j = i; j < data.tabs.length; j++) {
        if (data.tabs[j].windowId === oldId) {
          data.tabs[j].windowId = win.id;
        }
      }
    }

    for (const tab of data.tabs) {
      const { windowId, index, url, active, pinned } = tab;
      await createTab({ windowId, index, url, active, pinned });
    }
    await removeTabs(tabIds);
  }
});

// for testing
// chrome.storage.onChanged.addListener(function(changes) {
//   chrome.storage.local.get(null, function(data) {
//     console.log(data);
//   });
// });
