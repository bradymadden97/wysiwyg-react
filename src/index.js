import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Editor from './Editor';
import registerServiceWorker from './registerServiceWorker';

function _onExport(markup: string) {
  /* ACCESS EXPORT BUTTON HERE */
  for(var i = 0; i < string.length; i++){
	  console.log(markup.charCodeAt(i);
  }
  window.alert(markup);
}

const roots = Array.prototype.slice.call(document.getElementsByClassName('react-editor-root'));
roots.forEach((elem) => {
	ReactDOM.render(
		<Editor
			onExport={_onExport}
		/>,
		elem
	);
});

registerServiceWorker();
