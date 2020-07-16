import React, { useState } from 'react';

export default function NewSession(props) {
  const [name, setName] = useState('');

  function handleChange(event) {
    setName(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    props.handleSubmit({ name });
  }

  return (
    <div className="new-session simple">
      <a className="back-button" onClick={props.handleCancel} href="#">
        Back
      </a>
      <header>Give it a name.</header>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <input
            type="text"
            value={name}
            placeholder="e.g. Weekend Trip"
            onChange={handleChange}
          />
          <label>(optional)</label>
        </fieldset>
        <fieldset>
          <button
            type="submit"
            className="anchor-button"
          >
            Create Session
          </button>
        </fieldset>
      </form>
    </div>
  );
}
