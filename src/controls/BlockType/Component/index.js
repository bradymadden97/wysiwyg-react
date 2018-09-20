/* @flow */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Option from '../../../components/Option';
import Dropdown from '../../../components/Dropdown';
import DropdownOption from '../../../components/DropdownOption';
import './styles.css';

class LayoutComponent extends Component {
  static propTypes = {
    expanded: PropTypes.bool,
    onExpandEvent: PropTypes.func,
    doExpand: PropTypes.func,
    doCollapse: PropTypes.func,
    onChange: PropTypes.func,
    config: PropTypes.object,
    currentState: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      blockTypes: this.getBlockTypes(),
    };
  }

  componentWillReceiveProps(properties: Object): void {
      this.setState({
        blockTypes: this.getBlockTypes(),
      });
  }

  getBlockTypes = () => [
    { label: 'Normal', displayName: 'Normal' },
    { label: 'H1', displayName: 'H1' },
    { label: 'H2', displayName: 'H2' },
    { label: 'H3', displayName: 'H3' },
    { label: 'H4', displayName: 'H4' },
    { label: 'H5', displayName: 'H5' },
    { label: 'H6', displayName: 'H6' },
    { label: 'Blockquote', displayName: 'Blockquote' },
    { label: 'Code', displayName: 'Code' },
  ];

  renderFlat(blocks: Array<Object>): void {
    const { config: { className }, onChange, currentState: { blockType } } = this.props;
    return (
      <div className={classNames('rdw-inline-wrapper', className)}>
        {
          blocks.map((block, index) =>
            (<Option
              key={index}
              value={block.label}
              active={blockType === block.label}
              onClick={onChange}
            >
              {block.displayName}
            </Option>),
          )
        }
      </div>
    );
  }

  renderInDropdown(blocks: Array<Object>): void {
    const {
      config: { className, dropdownClassName, title },
      currentState: { blockType },
      expanded,
      doExpand,
      onExpandEvent,
      doCollapse,
      onChange,
    } = this.props;
    const { blockTypes } = this.state;
    const currentBlockData = blockTypes.filter(blk => blk.label === blockType);
    const currentLabel = currentBlockData && currentBlockData[0] && currentBlockData[0].displayName;
    return (
      <div className="rdw-block-wrapper" aria-label="rdw-block-control">
        <Dropdown
          className={classNames('rdw-block-dropdown', className)}
          optionWrapperClassName={classNames(dropdownClassName)}
          onChange={onChange}
          expanded={expanded}
          doExpand={doExpand}
          doCollapse={doCollapse}
          onExpandEvent={onExpandEvent}
          title={title}
        >
          <span>{currentLabel}</span>
          {
            blocks.map((block, index) =>
              (<DropdownOption
                active={blockType === block.label}
                value={block.label}
                key={index}
              >
                {block.displayName}
              </DropdownOption>))
          }
        </Dropdown>
      </div>
    );
  }

  render(): void {
    const { config } = this.props;
    const { inDropdown } = config;
    const { blockTypes } = this.state;
    const blocks = blockTypes.filter(({ label }) => config.options.includes(label));
    return inDropdown ? this.renderInDropdown(blocks) : this.renderFlat(blocks);
  }
}

export default LayoutComponent;
