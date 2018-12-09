/* @flow */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';

import LayoutComponent from './Component';

export default class Submission extends Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    editorState: PropTypes.object.isRequired,
    onExport: PropTypes.func,
	onReset: PropTypes.func,
    modalHandler: PropTypes.object,
    config: PropTypes.object,
  };

  state: Object = {};

  componentWillMount(): void {
    const { modalHandler } = this.props;
    modalHandler.registerCallBack(this.expandCollapse);
  }

  componentWillUnmount(): void {
    const { modalHandler } = this.props;
    modalHandler.deregisterCallBack(this.expandCollapse);
  }

  onExpandEvent: Function = (): void => {
    this.signalExpanded = !this.state.expanded;
  };

  expandCollapse: Function = (): void => {
    this.setState({
      expanded: this.signalExpanded,
    });
    this.signalExpanded = false;
  }

  onClick: Function = (btn): void => {
	const { editorState, onExport, onReset } = this.props;
	if (btn === "Submit") {
		const rawContentState = convertToRaw(editorState.getCurrentContent());

		const markup = draftToHtml(
		  rawContentState,
		);
		if (onExport) {
		  onExport(markup);
		}
	} else if (btn === "Reset") {
		onReset();		
	}
  }

  doExpand: Function = (): void => {
    this.setState({
      expanded: true,
    });
  };

  doCollapse: Function = (): void => {
    this.setState({
      expanded: false,
    });
  };

  render(): Object {
    const { config } = this.props;
    const { expanded } = this.state;
    const SubmissionComponent = config.component || LayoutComponent;
    return (
      <SubmissionComponent
        config={config}
        expanded={expanded}
        onExpandEvent={this.onExpandEvent}
        doExpand={this.doExpand}
        doCollapse={this.doCollapse}
        onClick={this.onClick}
      />
    );
  }
}
// make subscript less low
