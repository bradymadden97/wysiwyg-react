import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Editor from './Editor';

const roots = Array.prototype.slice.call(document.getElementsByClassName('react-editor-root'));
roots.forEach((elem) => {
	ReactDOM.render(
		<Editor
			initialText={document.getElementById("hiddentextareaanswer").value}
		/>,
		elem
	);
});
