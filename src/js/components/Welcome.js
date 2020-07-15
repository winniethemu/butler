import React from 'react';
import InboxIcon from '@material-ui/icons/Inbox';

export default function Welcome(props) {
  return (
    <div className="welcome simple">
      <div><InboxIcon style={{ fontSize: 48 }} /></div>
      <p className="tip">
        You don't have any existing browsing sessions. <a href="#" onClick={props.handleClick}>Create one</a> now.
      </p>
    </div>
  );
}
