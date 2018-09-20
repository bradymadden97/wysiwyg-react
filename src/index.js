import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Editor from './Editor';
import registerServiceWorker from './registerServiceWorker';

function onExport(markup: string) {
  /* ACCESS EXPORT BUTTON HERE */
  window.alert(markup);
}

ReactDOM.render(
  <Editor
    onExport={onExport}
  />,
  document.getElementById('react-editor-root')
);
registerServiceWorker();
