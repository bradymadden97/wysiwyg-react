import bold from '../icons/bold.svg';
import italic from '../icons/italic.svg';
import underline from '../icons/underline.svg';
import monospace from '../icons/monospace.svg';
import fontSize from '../icons/font-size.svg';
import left from '../icons/align-left.svg';
import center from '../icons/align-center.svg';
import right from '../icons/align-right.svg';
import undo from '../icons/undo.svg';
import redo from '../icons/redo.svg';

/**
* This is default toolbar configuration,
* whatever user passes in toolbar property is deeply merged with this to over-ride defaults.
*/
export default {
  options: ['inline', 'blockType', 'fontSize', 'textAlign', 'history', 'insertion', 'submission'],
  inline: {
    inDropdown: false,
    className: undefined,
    component: undefined,
    dropdownClassName: undefined,
    options: ['bold', 'italic', 'underline'],
    bold: { icon: bold, className: undefined, title: undefined },
    italic: { icon: italic, className: undefined, title: undefined },
    underline: { icon: underline, className: undefined, title: undefined },
    monospace: { icon: monospace, className: undefined, title: undefined },
  },
  blockType: {
    inDropdown: true,
    options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'Blockquote', 'Code'],
    className: undefined,
    component: undefined,
    dropdownClassName: undefined,
    title: undefined,
  },
  fontSize: {
    icon: fontSize,
    options: [8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48, 60, 72, 96],
    className: undefined,
    component: undefined,
    dropdownClassName: undefined,
    title: undefined,
  },
  textAlign: {
    inDropdown: false,
    className: undefined,
    component: undefined,
    dropdownClassName: undefined,
    options: ['left', 'center', 'right'],
    left: { icon: left, className: undefined, title: undefined },
    center: { icon: center, className: undefined, title: undefined },
    right: { icon: right, className: undefined, title: undefined },
    title: undefined,
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
