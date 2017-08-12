/* @flow */

import React from 'react';

type State = {
  rejectionHandlers: Object,
  resolveHandlers: Object
}

type Props = {
  id: number,
  component: any,
  props: Object,
  _reject: (id: number, reason: Error) => void,
  _resolve: (id: number, value: any) => void,
  onCancel: () => void,
  rejecters: [string],
  resolvers: [string]
}

export default class PlaceholderChild extends React.PureComponent {
  props: Props
  state: State

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
    const resolveHandlers = props.resolvers.reduce((o: Object, key: string) =>
      ({ ...o,
        [key]: this.handleResolve.bind(this, key),
      }),
      {});
    return resolveHandlers;
  }

  getRejectionHandlers(props: Props) {
    const rejectionHandlers = props.rejecters.reduce((o: Object, key: string) =>
      ({ ...o,
        [key]: this.handleReject.bind(this, key),
      }),
      {});
    return rejectionHandlers;
  }

  handleResolve(parentPropName: string, value: any, ...rest: Array<any>) {
    const { id, _resolve } = this.props;
    _resolve(id, value);
    this.props.props[parentPropName] && this.props.props[parentPropName](value, ...rest);
  }

  handleReject(parentPropName: string, reason: Error, ...rest: Array<any>) {
    const { id, _reject } = this.props;
    _reject(id, reason);
    this.props.props[parentPropName] && this.props.props[parentPropName](reason, ...rest);
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
