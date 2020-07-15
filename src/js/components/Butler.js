import React, { useState, useLayoutEffect } from 'react';

import Welcome from './Welcome.js';
import SessionList from './SessionList.js';
import NewSession from './NewSession.js';

import {
  getCurrentSession,
  getSessions,
  getTabs,
  setCurrentSession,
  setSessions,
  uniqueId
} from '../util.js';

export default function Butler(props) {
  const [create, setCreate] = useState(false);
  const [items, setItems] = useState([]);

  useLayoutEffect(() => {
    async function fetchData() {
      const data = await getSessions();
      setItems(Object.keys(data));
    }
    fetchData();
  }, []);

  function handleNew() {
    setCreate(true);
  }

  function handleCancel() {
    setCreate(false);
  }

  async function handleCreate(data) {
    const id = uniqueId();
    await setCurrentSession(id);

    const sessions = await getSessions();
    const tabs = await getTabs();
    sessions[id] = { name: data.name, timestamp: Date.now(), tabs };
    await setSessions(sessions);
    setCreate(false);
    setItems(Object.keys(sessions));
  }

  async function handleDelete(id) {
    const current = await getCurrentSession();
    if (current === id) await setCurrentSession(null);
    const sessions = await getSessions();
    delete sessions[id];
    await setSessions(sessions);
    setItems(Object.keys(sessions));
  }

  async function handleRestore(session) {
    // delegate to background because tab creation and removal
    // switch context out of popup resulting in partial execution
    chrome.runtime.sendMessage({ message: 'restore', data: session });
  }

  async function handleChange(id, session) {
    const current = await getCurrentSession();
    if (current) {
      await setCurrentSession(null);
    } else {
      await setCurrentSession(id);
      await handleRestore(session);
    }
  }

  return (
    <div className="app">
      {create &&
        <NewSession
          handleCancel={handleCancel}
          handleSubmit={handleCreate}
        />
      }
      {!create && items.length < 1 && <Welcome handleClick={handleNew} />}
      {!create && items.length > 0 &&
        <SessionList
          handleChange={handleChange}
          handleDelete={handleDelete}
          handleNew={handleNew}
        />
      }
    </div>
  );
}
