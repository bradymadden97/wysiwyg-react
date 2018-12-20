import bold from '../icons/bold.svg';
import italic from '../icons/italic.svg';
import underline from '../icons/underline.svg';
import undo from '../icons/undo.svg';
import redo from '../icons/redo.svg';

/**
* This is default toolbar configuration,
* whatever user passes in toolbar property is deeply merged with this to over-ride defaults.
*/
export default {
  options: ['inline', 'insertion', 'history', 'submission'],
  inline: {
    inDropdown: false,
    className: undefined,
    component: undefined,
    dropdownClassName: undefined,
    options: ['bold', 'italic', 'underline'],
    bold: { icon: bold, className: undefined, title: undefined },
    italic: { icon: italic, className: undefined, title: undefined },
    underline: { icon: underline, className: undefined, title: undefined },
  },
  insertion: {
    inDropdown: false,
    className: undefined,
    component: undefined,
    dropdownClassName: undefined,
    options: ['emdash', 'endash', 'lapostrophe', 'rapostrophe', 'lquotation', 'rquotation'],
    emdash: {className: 'insertionChar underline', title: 'EM', value: '\u2014'},
    endash: {className: 'insertionChar underline', title: 'EN', value: '\u2013'},
    lapostrophe: {className: 'insertionChar', title: '\u2018', value: '\u2018'},
    rapostrophe: {className: 'insertionChar', title: '\u2019', value: '\u2019'},
    lquotation: {className: 'insertionChar', title: '\u201C', value: '\u201C'},
    rquotation: {className: 'insertionChar', title: '\u201D', value: '\u201D'},
    title: undefined
  },  
  history: {
    inDropdown: false,
    className: undefined,
    component: undefined,
    dropdownClassName: undefined,
    options: ['undo', 'redo'],
    undo: { icon: undo, className: undefined, title: undefined },
    redo: { icon: redo, className: undefined, title: undefined },
    title: undefined,
  },
  submission: {
    inDropdown: false,
    className: undefined,
    component: undefined,
    dropdownClassName: undefined,
    options: ['export', 'reset'],
    export: {className: 'exportBtn', title: undefined, value: "Submit", type: "submit"},
	reset: {className: 'resetBtn', title: undefined, value: "Reset", type: undefined},
    title: undefined
  }
};
