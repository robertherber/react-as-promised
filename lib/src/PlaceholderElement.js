/* @flow */
import React from 'react';

type Props = {
  children: Array<any>
}

export default class PlaceholderElement extends React.Component {
  props: Props
  render() {
    return <div>{ this.props.children }</div>;
  }
}
