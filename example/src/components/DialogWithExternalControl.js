/* @flow */

import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

type Props = {
  onProceed: () => void,
  onDismiss: () => void,
  open: boolean
}

export default class DialogWithExternalControl extends React.Component {
  props: Props

  render() {
    const actions = [
      <FlatButton
        label='Dismiss'
        primary
        onClick={() => this.props.onDismiss(new Error('User dismissed the dialog!'))}
      />,
      <FlatButton
        label='Proceed'
        primary
        onClick={() => this.props.onProceed('Yehaa!')}
      />,
    ];

    return (
      <Dialog
        actions={actions}
        modal={false}
        open={this.props.open}
        onRequestClose={this.props.onDismiss}
      >
        Discard changes?
      </Dialog>
    );
  }
}
