/* @flow */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { EditorState, Modifier } from 'draft-js';

import LayoutComponent from './Component';

export default class Insertion extends Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    editorState: PropTypes.object.isRequired,
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

  insertCharacter: Function = (character: string): void => {
    const { editorState, onChange } = this.props;
    const newState = EditorState.push(
      editorState,
      Modifier.replaceText(
        editorState.getCurrentContent(),
        editorState.getSelection(),
        character,
        editorState.getCurrentInlineStyle()
      ),
      'insert-characters',
    );
    if (newState) {
      onChange(newState);
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
    const InsertionComponent = config.component || LayoutComponent;
    return (
      <InsertionComponent
        config={config}
        expanded={expanded}
        onExpandEvent={this.onExpandEvent}
        doExpand={this.doExpand}
        doCollapse={this.doCollapse}
        onClick={this.insertCharacter}
      />
    );
  }
}
// make subscript less low
