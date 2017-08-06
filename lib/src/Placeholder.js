/* @flow */

import React from 'react';
import Promise from 'bluebird';
import { omit, map } from 'lodash/fp';
import { emitter } from './emitter';
import PlaceholderChild from './PlaceholderChild';
import PlaceholderElement from './PlaceholderElement';

type Props = {
  cleanUpDelay: number
}

type State = {
  views: Object
}

class Placeholder extends React.Component {
  props: Props
  state: State

  constructor(props) {
    super(props);

    this.reject = this.reject.bind(this);
    this.resolve = this.resolve.bind(this);

    emitter.addListener('updateProps', (id, newProps) => {
      const { views } = this.state;

      this.setState({
        views: {
          ...views,
          [id]: {
            ...views[id],
            props: {
              ...views[id].props,
              ...newProps,
            },
          },
        },
      });
    });

    emitter.addListener('presentView', (id, component, initialProps, resolve, reject, onCancel, resolvers, rejecters) => {
      const { views } = this.state;

      let onCancelInternal;

      if (onCancel) {
        onCancel(() => {
          onCancelInternal && onCancelInternal();
          initialProps.onCancel && initialProps.onCancel();
          this.onCancel(id);
        });
      }

      this.setState({
        views: {
          ...views,
          [id]: {
            id,
            component,
            props: initialProps,
            resolve,
            reject,
            resolvers,
            rejecters,
            onCancel: (cb) => { onCancelInternal = cb; },
          },
        },
      });
    });

    this.timeouts = [];

    this.state = {
      views: {},
    };
  }

  componentWillUnmount() {
    this.timeouts.each((t) => {
      t.cancel && t.cancel();
    });
  }

  cleanUpAfterDelay(index) {
    const timeout = Promise.delay(this.props.cleanUpDelay || 2000).then(() => {
      this.setState({
        views: omit(index, this.state.views),
      });
    });
    this.timeouts.push(timeout);
  }

  onCancel(index) {
    this.cleanUpAfterDelay(index);
  }

  resolve(index, value) {
    this.state.views[index].resolve(value);
    this.cleanUpAfterDelay(index);
  }

  reject(index, error) {
    this.state.views[index].reject(error || new Error('View closed with a rejection'));
    this.cleanUpAfterDelay(index);
  }

  render() {
    const children = map(({ component, props, id, onCancel, resolvers, rejecters }) => (
      <PlaceholderChild
        props={props}
        component={component}
        id={id}
        key={id}
        resolvers={resolvers}
        rejecters={rejecters}
        _resolve={this.resolve}
        _reject={this.reject}
        onCancel={onCancel}
      />
    ), this.state.views) || [];

    return <PlaceholderElement>{ children }</PlaceholderElement>;
  }
}

export default Placeholder;
