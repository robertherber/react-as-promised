/* @flow */
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { View } from 'react-native';

type Props = {
  children: Array<any>
}

export default class PlaceholderElement extends React.Component {
  props: Props
  render() {
    return <View>{ this.props.children }</View>;
  }
}
