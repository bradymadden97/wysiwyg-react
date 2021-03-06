/* @flow */

import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Editor,
  EditorState,
  ContentState,
  RichUtils,
  convertToRaw,
  convertFromRaw,
  CompositeDecorator
} from "draft-js";
import {
  changeDepth,
  handleNewLine,
  blockRenderMap,
  getCustomStyleMap,
  extractInlineStyle,
  getSelectedBlocksType
} from "draftjs-utils";
import classNames from "classnames";
import ModalHandler from "../event-handler/modals";
import FocusHandler from "../event-handler/focus";
import KeyDownHandler from "../event-handler/keyDown";
import SuggestionHandler from "../event-handler/suggestions";
import blockStyleFn from "../utils/BlockStyle";
import { mergeRecursive } from "../utils/toolbar";
import { hasProperty, filter } from "../utils/common";
import { handlePastedText } from "../utils/handlePaste";
import Controls from "../controls";
import getBlockRenderFunc from "../renderer";
import defaultToolbar from "../config/defaultToolbar";
import "./styles.css";
import "./Draft.css";
import draftToHtml from 'draftjs-to-html';
import DraftPasteProcessor from 'draft-js/lib/DraftPasteProcessor';

export default class WysiwygEditor extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    onEditorStateChange: PropTypes.func,
    onContentStateChange: PropTypes.func,
    // initialContentState is deprecated
    initialContentState: PropTypes.object,
    defaultContentState: PropTypes.object,
    contentState: PropTypes.object,
    editorState: PropTypes.object,
    defaultEditorState: PropTypes.object,
    toolbarOnFocus: PropTypes.bool,
    spellCheck: PropTypes.bool, // eslint-disable-line react/no-unused-prop-types
    stripPastedStyles: PropTypes.bool, // eslint-disable-line react/no-unused-prop-types
    toolbar: PropTypes.object,
    toolbarCustomButtons: PropTypes.array,
    toolbarClassName: PropTypes.string,
    toolbarHidden: PropTypes.bool,
    editorClassName: PropTypes.string,
    wrapperClassName: PropTypes.string,
    toolbarStyle: PropTypes.object,
    editorStyle: PropTypes.object,
    wrapperStyle: PropTypes.object,
    uploadCallback: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onTab: PropTypes.func,
    mention: PropTypes.object,
    hashtag: PropTypes.object,
    textAlignment: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
    readOnly: PropTypes.bool,
    tabIndex: PropTypes.number, // eslint-disable-line react/no-unused-prop-types
    placeholder: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
    ariaLabel: PropTypes.string,
    ariaOwneeID: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
    ariaActiveDescendantID: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
    ariaAutoComplete: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
    ariaDescribedBy: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
    ariaExpanded: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
    ariaHasPopup: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
    customBlockRenderFunc: PropTypes.func,
    wrapperId: PropTypes.number,
    customDecorators: PropTypes.array,
    editorRef: PropTypes.func,
    onExport: PropTypes.func,
	initialText: PropTypes.string
  };

  static defaultProps = {
    toolbarOnFocus: false,
    toolbarHidden: false,
    stripPastedStyles: false,
    customDecorators: [],
	initialText: ""
  };

  constructor(props) {
    super(props);
    const toolbar = mergeRecursive(defaultToolbar, props.toolbar);
    this.state = {
      editorState: undefined,
      editorFocused: false,
      toolbar
    };
    const wrapperId = props.wrapperId
      ? props.wrapperId
      : Math.floor(Math.random() * 10000);
    this.wrapperId = `rdw-wrapper-${wrapperId}`;
    this.modalHandler = new ModalHandler();
    this.focusHandler = new FocusHandler();
    this.blockRendererFn = getBlockRenderFunc(
      {
        isReadOnly: this.isReadOnly,
        isImageAlignmentEnabled: this.isImageAlignmentEnabled,
        getEditorState: this.getEditorState,
        onChange: this.onChange
      },
      props.customBlockRenderFunc
    );
    this.editorProps = this.filterEditorProps(props);
    this.customStyleMap = getCustomStyleMap();
  }

  componentWillMount(): void {
    this.compositeDecorator = this.getCompositeDecorator();
	let editorState;
	if (this.props.initialText) {
		const processedHTML = DraftPasteProcessor.processHTML(this.props.initialText);
		const contentState = ContentState.createFromBlockArray(processedHTML);
		editorState = EditorState.createWithContent(contentState);
        editorState = EditorState.moveFocusToEnd(editorState);
    } else {
		editorState = this.createEditorState(this.compositeDecorator);
	}
    extractInlineStyle(editorState);
    this.setState({
      editorState
    });
  }

  componentDidMount(): void {
    this.modalHandler.init(this.wrapperId);
	this.editor.focus();
	const markup = draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()));
	document.getElementById("hiddentextareaanswer").value = markup;
  }
  // todo: change decorators depending on properties recceived in componentWillReceiveProps.

  componentWillReceiveProps(props) {
    const newState = {};
    if (this.props.toolbar !== props.toolbar) {
      const toolbar = mergeRecursive(defaultToolbar, props.toolbar);
      newState.toolbar = toolbar;
    }
    if (
      hasProperty(props, "editorState") &&
      this.props.editorState !== props.editorState
    ) {
      if (props.editorState) {
        newState.editorState = EditorState.set(props.editorState, {
          decorator: this.compositeDecorator
        });
      } else {
        newState.editorState = EditorState.createEmpty(this.compositeDecorator);
      }
    } else if (
      hasProperty(props, "contentState") &&
      this.props.contentState !== props.contentState
    ) {
      if (props.contentState) {
        const newEditorState = this.changeEditorState(props.contentState);
        if (newEditorState) {
          newState.editorState = newEditorState;
        }
      } else {
        newState.editorState = EditorState.createEmpty(this.compositeDecorator);
      }
    }
    if (
      props.editorState !== this.props.editorState ||
      props.contentState !== this.props.contentState
    ) {
      extractInlineStyle(newState.editorState);
    }
    this.setState(newState);
    this.editorProps = this.filterEditorProps(props);
    this.customStyleMap = getCustomStyleMap();
  }

  onEditorBlur: Function = (): void => {
    this.setState({
      editorFocused: false
    });
  };

  onEditorFocus: Function = (event): void => {
    const { onFocus } = this.props;
    this.setState({
      editorFocused: true
    });
    const editFocused = this.focusHandler.isEditorFocused();
    if (onFocus && editFocused) {
      onFocus(event);
    }
  };

  onEditorMouseDown: Function = (): void => {
    this.focusHandler.onEditorMouseDown();
  };

  onTab: Function = (event): boolean => {
    const { onTab } = this.props;
    if (!onTab || !onTab(event)) {
      const editorState = changeDepth(
        this.state.editorState,
        event.shiftKey ? -1 : 1,
        4
      );
      if (editorState && editorState !== this.state.editorState) {
        this.onChange(editorState);
        event.preventDefault();
      }
    }
  };

  onUpDownArrow: Function = (event): boolean => {
    if (SuggestionHandler.isOpen()) {
      event.preventDefault();
    }
  };

  onToolbarFocus: Function = (event): void => {
    const { onFocus } = this.props;
    if (onFocus && this.focusHandler.isToolbarFocused()) {
      onFocus(event);
    }
  };

  onWrapperBlur: Function = (event: Object) => {
    const { onBlur } = this.props;
    if (onBlur && this.focusHandler.isEditorBlur(event)) {
      onBlur(event, this.getEditorState());
    }
  };

  onChange: Function = (editorState: Object): void => {
    const { readOnly, onEditorStateChange } = this.props;
	
    if (
      !readOnly &&
      !(
        getSelectedBlocksType(editorState) === "atomic" &&
        editorState.getSelection().isCollapsed
      )
    ) {
      if (onEditorStateChange) {
        onEditorStateChange(editorState, this.props.wrapperId);
      }
      if (!hasProperty(this.props, "editorState")) {
        this.setState({ editorState }, this.afterChange(editorState));
      } else {
        this.afterChange(editorState);
      }
    }
	
    const markup = draftToHtml(convertToRaw(editorState.getCurrentContent()));
	document.getElementById("hiddentextareaanswer").value = markup;
  };

  setWrapperReference: Function = (ref: Object): void => {
    this.wrapper = ref;
  };

  setEditorReference: Function = (ref: Object): void => {
    if (this.props.editorRef) {
      this.props.editorRef(ref);
    }
    this.editor = ref;
  };

  getCompositeDecorator = (): void => {
    const decorators = [...this.props.customDecorators];
    return new CompositeDecorator(decorators);
  };

  getWrapperRef = () => this.wrapper;

  getEditorState = () => this.state.editorState;

  getSuggestions = () => this.props.mention && this.props.mention.suggestions;

  afterChange: Function = (editorState): void => {
    setTimeout(() => {
      const { onChange, onContentStateChange } = this.props;
      if (onChange) {
        onChange(convertToRaw(editorState.getCurrentContent()));
      }
      if (onContentStateChange) {
        onContentStateChange(convertToRaw(editorState.getCurrentContent()));
      }
    });
  };

  isReadOnly = () => this.props.readOnly;

  isImageAlignmentEnabled = () => this.state.toolbar.image.alignmentEnabled;

  createEditorState = compositeDecorator => {
    let editorState;
    if (hasProperty(this.props, "editorState")) {
      if (this.props.editorState) {
        editorState = EditorState.set(this.props.editorState, {
          decorator: compositeDecorator
        });
      }
    } else if (hasProperty(this.props, "defaultEditorState")) {
      if (this.props.defaultEditorState) {
        editorState = EditorState.set(this.props.defaultEditorState, {
          decorator: compositeDecorator
        });
      }
    } else if (hasProperty(this.props, "contentState")) {
      if (this.props.contentState) {
        const contentState = convertFromRaw(this.props.contentState);
        editorState = EditorState.createWithContent(
          contentState,
          compositeDecorator
        );
        editorState = EditorState.moveSelectionToEnd(editorState);
      }
    } else if (
      hasProperty(this.props, "defaultContentState") ||
      hasProperty(this.props, "initialContentState")
    ) {
      let contentState =
        this.props.defaultContentState || this.props.initialContentState;
      if (contentState) {
        contentState = convertFromRaw(contentState);
        editorState = EditorState.createWithContent(
          contentState,
          compositeDecorator
        );
        editorState = EditorState.moveSelectionToEnd(editorState);
      }
    }
    if (!editorState) {
      editorState = EditorState.createEmpty(compositeDecorator);
    }
    return editorState;
  };

  filterEditorProps = props =>
    filter(props, [
      "onChange",
      "onEditorStateChange",
      "onContentStateChange",
      "initialContentState",
      "defaultContentState",
      "contentState",
      "editorState",
      "defaultEditorState",
      "toolbarOnFocus",
      "toolbar",
      "toolbarCustomButtons",
      "toolbarClassName",
      "editorClassName",
      "toolbarHidden",
      "wrapperClassName",
      "toolbarStyle",
      "editorStyle",
      "wrapperStyle",
      "uploadCallback",
      "onFocus",
      "onBlur",
      "onTab",
      "mention",
      "hashtag",
      "ariaLabel",
      "customBlockRenderFunc",
      "customDecorators",
      "handlePastedText"
    ]);

  changeEditorState = contentState => {
    const newContentState = convertFromRaw(contentState);
    let { editorState } = this.state;
    editorState = EditorState.push(
      editorState,
      newContentState,
      "insert-characters"
    );
    editorState = EditorState.moveSelectionToEnd(editorState);
    return editorState;
  };

  focusEditor: Function = (): void => {
    setTimeout(() => {
      this.editor.focus();
    });
  };

  handleKeyCommand: Function = (command: Object): boolean => {
    const { editorState, toolbar: { inline } } = this.state;
    if (inline && inline.options.indexOf(command) >= 0) {
      const newState = RichUtils.handleKeyCommand(editorState, command);
      if (newState) {
        this.onChange(newState);
        return true;
      }
    }
    return false;
  };

  handleReturn: Function = (event: Object): boolean => {
    if (SuggestionHandler.isOpen()) {
      return true;
    }
    const editorState = handleNewLine(this.state.editorState, event);
    if (editorState) {
      this.onChange(editorState);
      return true;
    }
    return false;
  };

  handlePastedText = (text, html) => {
    const { editorState } = this.state;

    if (this.props.handlePastedText) {
      return this.props.handlePastedText(
        text,
        html,
        editorState,
        this.onChange
      );
    }
    if (!this.props.stripPastedStyles) {
      return handlePastedText(text, html, editorState, this.onChange);
    }
    return false;
  };

  preventDefault: Function = (event: Object) => {
    if (event.target.tagName === "INPUT" || event.target.tagName === "LABEL") {
      this.focusHandler.onInputMouseDown();
    } else {
      event.preventDefault();
    }
  };
  
  onReset = () => {        
	let newContentState;
    if (this.props.initialText) {
        const processedHTML = DraftPasteProcessor.processHTML(this.props.initialText);
        newContentState = ContentState.createFromBlockArray(processedHTML);
    }
    else {
		newContentState = ContentState.createFromText('');
    }
	
	let newEditorState = EditorState.push(this.state.editorState, newContentState);
	newEditorState = EditorState.moveFocusToEnd(newEditorState);
	this.setState({editorState: newEditorState});

  }

  render() {
    const { editorState, editorFocused, toolbar } = this.state;
    const {
      toolbarCustomButtons,
      toolbarOnFocus,
      toolbarClassName,
      toolbarHidden,
      editorClassName,
      wrapperClassName,
      toolbarStyle,
      editorStyle,
      wrapperStyle,
      uploadCallback,
      ariaLabel
    } = this.props;

    const controlProps = {
      modalHandler: this.modalHandler,
      editorState,
      onChange: this.onChange,
      onExport: this.props.onExport,
	  onReset: this.onReset,
    };
    const toolbarShow =
      editorFocused || this.focusHandler.isInputFocused() || !toolbarOnFocus;
    return (
		<>
		  <div
			id={this.wrapperId}
			className={classNames(wrapperClassName, "rdw-editor-wrapper")}
			style={wrapperStyle}
			onClick={this.modalHandler.onEditorClick}
			onBlur={this.onWrapperBlur}
			aria-label="rdw-wrapper"
		  >
			{!toolbarHidden && (
				<div
				  className={classNames("rdw-editor-toolbar", toolbarClassName)}
				  style={{
					visibility: toolbarShow ? "visible" : "hidden",
					...toolbarStyle
				  }}
				  onMouseDown={this.preventDefault}
				  aria-label="rdw-toolbar"
				  aria-hidden={(!editorFocused && toolbarOnFocus).toString()}
				  onFocus={this.onToolbarFocus}
				>
				  {toolbar.options.map((opt, index) => {
					const Control = Controls[opt];
					const config = toolbar[opt];
					if (opt === "image" && uploadCallback) {
					  config.uploadCallback = uploadCallback;
					}
					
					let ControlBlock;
					if (opt === "inline" || opt === "submission" ) {
						ControlBlock = <div key={index} className={classNames("rdw-control-container")}><Control key={index} {...controlProps} config={config} /></div>;
					} else {
						ControlBlock = <div key={index} ><Control key={index} {...controlProps} config={config} /></div>;
					}
					
					return ControlBlock;
				  })}
				  {toolbarCustomButtons &&
					toolbarCustomButtons.map((button, index) =>
					  React.cloneElement(button, { key: index, ...controlProps })
					)}
				</div>

			)}
			<div
			  ref={this.setWrapperReference}
			  className={classNames(editorClassName, "rdw-editor-main")}
			  style={editorStyle}
			  onClick={this.focusEditor}
			  onFocus={this.onEditorFocus}
			  onBlur={this.onEditorBlur}
			  onKeyDown={KeyDownHandler.onKeyDown}
			  onMouseDown={this.onEditorMouseDown}
			>
			  <Editor
				ref={this.setEditorReference}
				onTab={this.onTab}
				onUpArrow={this.onUpDownArrow}
				onDownArrow={this.onUpDownArrow}
				editorState={editorState}
				onChange={this.onChange}
				blockStyleFn={blockStyleFn}
				customStyleMap={getCustomStyleMap()}
				handleReturn={this.handleReturn}
				handlePastedText={this.handlePastedText}
				blockRendererFn={this.blockRendererFn}
				handleKeyCommand={this.handleKeyCommand}
				ariaLabel={ariaLabel || "rdw-editor"}
				blockRenderMap={blockRenderMap}
				{...this.editorProps}
			  />
			</div>
		  </div>
	  </>
    );
  }
}
// todo: evaluate draftjs-utils to move some methods here
// todo: move color near font-family
