/* @flow */
import React from 'react';
import { CircularProgress } from 'material-ui';

const style = {
  width: '100%',
  height: '100%',
  position: 'fixed',
  justifyContent: 'center',
  flex: 1,
  alignItems: 'center',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: 'rgba(0,0,0,0.7)',
  display: 'flex',
  zIndex: 9999,
};

type Props = {
  resolve: () => void,
  reject: () => void,
  onCancel: () => void,
}

export default class LoadingIndicator extends React.Component {
  props: Props

  render() {
    return (<div style={style}>
      <CircularProgress
        size={80}
        color='white'
        thickness={5}
      />
    </div>);
  }
}
