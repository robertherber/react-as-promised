/* @flow */

import React from 'react';
import Promise from 'bluebird';
import { omit, map, forEach } from 'lodash/fp';
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

  reject: (id: number, reason: Error) => void
  resolve: (id: number, value: any) => void

  constructor(props: Props) {
    super(props);

    this.reject = this.reject.bind(this);
    this.resolve = this.resolve.bind(this);

    emitter.addListener('updateProps', (id, newProps) => {
      const { views } = this.state;

      if (views[id]) {
        const newViews = {
          ...views,
          [id]: {
            ...views[id],
            props: {
              ...views[id].props,
              ...newProps,
            },
          },
        };

        this.setState({
          views: newViews,
        });
      }
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
    forEach((t) => {
      t.cancel && t.cancel();
    }, this.timeouts);
  }

  cleanUpAfterDelay(index: number) {
    const timeout = Promise.delay(this.props.cleanUpDelay || 2000).then(() => {
      this.setState({
        views: omit(index, this.state.views),
      });
    });
    this.timeouts.push(timeout);
  }

  timeouts: Array<Promise>

  onCancel(index: number) {
    this.cleanUpAfterDelay(index);
  }

  resolve(index: number, value: any) {
    this.state.views[index].resolve(value);
    this.cleanUpAfterDelay(index);
  }

  reject(index: number, reason: Error) {
    this.state.views[index].reject(reason || new Error('View closed with a rejection'));
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
