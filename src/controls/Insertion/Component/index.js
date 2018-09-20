/* @flow */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Option from '../../../components/Option';

import './styles.css';

export default class Insertion extends Component {
  static propTypes = {
    expanded: PropTypes.bool,
    doExpand: PropTypes.func,
    doCollapse: PropTypes.func,
    onExpandEvent: PropTypes.func,
    config: PropTypes.object,
    onClick: PropTypes.func,
  };

  render(): Object {
    const { config, onClick } = this.props;
    return (
      <div className={classNames('rdw-insertion-wrapper', config.className)} aria-label="rdw-inline-control">
        {
          config.options
            .map((style, index) =>
              (<Option
                key={index}
                value={style}
                onClick={() => onClick(config[style].value)}
                className={classNames(config[style].className)}
                active={false}
                title={config[style].title}
              >
                {config[style].icon ?
                  (<img
                    alt=""
                    src={config[style].icon}
                  />) : config[style].value
                }
              </Option>),
            )
        }
      </div>
    );
  }
}

// todo: make subscript less low
