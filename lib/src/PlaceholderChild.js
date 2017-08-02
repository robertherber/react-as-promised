/* @flow */

import React from 'react';

type Props = {
  id: number,
  component: any,
  props: Object,
  _reject: (id: number, error: Error) => void,
  _resolve: (id: number, value: any) => void,
  onCancel: () => void,
  rejecters: [string],
  resolvers: [string]
}

export default class PlaceholderChild extends React.PureComponent {
  props: Props

  constructor(props: Props) {
    super(props);

    this.state = {
      rejectionHandlers: this.getRejectionHandlers(props),
      resolveHandlers: this.getResolveHandlers(props),
    };
  }

  componentWillReceiveProps(newProps: Props) {
    if (this.props.rejecters !== newProps.rejecters) {
      this.setState({
        rejectionHandlers: this.getRejectionHandlers(newProps),
      });
    }
    if (this.props.resolvers !== newProps.resolvers) {
      this.setState({
        resolveHandlers: this.getResolveHandlers(newProps),
      });
    }
  }

  getResolveHandlers(props: Props) {
    const resolveHandlers = props.resolvers.reduce((o, key) =>
      ({ ...o,
        [key]: this.handleResolve.bind(this, key),
      }),
      {});
    return resolveHandlers;
  }

  getRejectionHandlers(props: Props) {
    const rejectionHandlers = props.rejecters.reduce((o, key) =>
      ({ ...o,
        [key]: this.handleReject.bind(this, key),
      }),
      {});
    return rejectionHandlers;
  }

  handleResolve(parentPropName, value, ...rest) {
    const { id, _resolve } = this.props;
    _resolve(id, value);
    this.props.props[parentPropName] && this.props.props[parentPropName](value, ...rest);
  }

  handleReject(parentPropName, error, ...rest) {
    const { id, _reject } = this.props;
    _reject(id, error);
    this.props.props[parentPropName] && this.props.props[parentPropName](error, ...rest);
  }

  render() {
    const { component: Component, props } = this.props;
    return (<Component
      {...props}
      {...this.state.rejectionHandlers}
      {...this.state.resolveHandlers}
      onCancel={this.props.onCancel}
    />);
  }
}
