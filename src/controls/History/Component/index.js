/* @flow */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { getFirstIcon } from '../../../utils/toolbar';
import Option from '../../../components/Option';
import Dropdown from '../../../components/Dropdown';
import DropdownOption from '../../../components/DropdownOption';
import './styles.css';

export default class History extends Component {
  static propTypes = {
    expanded: PropTypes.bool,
    doExpand: PropTypes.func,
    doCollapse: PropTypes.func,
    onExpandEvent: PropTypes.func,
    config: PropTypes.object,
    onChange: PropTypes.func,
    currentState: PropTypes.object,
  };

  onChange = (obj) => {
    const { onChange } = this.props;
    onChange(obj);
  }

  renderInDropDown(): Object {
    const {
      config,
      expanded,
      doExpand,
      onExpandEvent,
      doCollapse,
      currentState: { undoDisabled, redoDisabled },
    } = this.props;
    const { options, undo, redo, className, dropdownClassName, title } = config;
    return (
      <Dropdown
        className={classNames('rdw-history-dropdown', className)}
        optionWrapperClassName={classNames(dropdownClassName)}
        expanded={expanded}
        doExpand={doExpand}
        doCollapse={doCollapse}
        onExpandEvent={onExpandEvent}
        aria-label="rdw-history-control"
        title={title}
      >
        <img
          src={getFirstIcon(config)}
          alt=""
        />
        {options.indexOf('undo') >= 0 && <DropdownOption
          value="undo"
          onClick={this.onChange}
          disabled={undoDisabled}
          className={classNames('rdw-history-dropdownoption', undo.className)}
          title={undo.title}
        >
          <img
            src={undo.icon}
            alt=""
          />
        </DropdownOption>}
        {options.indexOf('redo') >= 0 && <DropdownOption
          value="redo"
          onClick={this.onChange}
          disabled={redoDisabled}
          className={classNames('rdw-history-dropdownoption', redo.className)}
          title={redo.title}
        >
          <img
            src={redo.icon}
            alt=""
          />
        </DropdownOption>}
      </Dropdown>
    );
  }

  renderInFlatList(): Object {
    const {
      config: { options, undo, redo, className },
      currentState: { undoDisabled, redoDisabled },
    } = this.props;
    return (
      <div className={classNames('rdw-history-wrapper', className)} aria-label="rdw-history-control">
        {options.indexOf('undo') >= 0 && <Option
          value="undo"
          onClick={this.onChange}
          className={classNames(undo.className)}
          disabled={undoDisabled}
          title={undo.title}
        >
          <img
            src={undo.icon}
            alt=""
          />
        </Option>}
        {options.indexOf('redo') >= 0 && <Option
          value="redo"
          onClick={this.onChange}
          className={classNames(redo.className)}
          disabled={redoDisabled}
          title={redo.title}
        >
          <img
            src={redo.icon}
            alt=""
          />
        </Option>}
      </div>
    );
  }

  render(): Object {
    const { config } = this.props;
    if (config.inDropdown) {
      return this.renderInDropDown();
    }
    return this.renderInFlatList();
  }
}
