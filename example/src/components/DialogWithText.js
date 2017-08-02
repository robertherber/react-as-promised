/* @flow */

import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

type Props = {
  reject: () => void,
  resolve: () => void,
  onCancel: () => void,
}

export default class MyDialogWithText extends React.Component {
  props: Props

  state = {
    open: true,
    text: '',
  };

  constructor(props: Props) {
    super(props);

    this.handleDismiss = this.handleDismiss.bind(this);
    this.handleOK = this.handleOK.bind(this);
    this.onTextChanged = this.onTextChanged.bind(this);

    props.onCancel && props.onCancel(this.handleAbort.bind(this));
  }

  handleAbort() {
    this.setState({ open: false });
  }

  handleDismiss() {
    this.setState({ open: false });
    this.props.reject(new Error('The user pressed dismiss'));
  }

  handleOK() {
    this.setState({ open: false });
    this.props.resolve(`The user pressed proceed with message: ${this.state.text}`);
  }

  onTextChanged(evt, text) {
    this.setState({ text });
  }

  render() {
    const actions = [
      <FlatButton
        label='Dismiss'
        primary
        onClick={this.handleDismiss}
      />,
      <FlatButton
        label='Proceed'
        primary
        onClick={this.handleOK}
      />,
    ];

    return (
      <Dialog
        actions={actions}
        modal={false}
        open={this.state.open}
        onRequestClose={this.handleDismiss}
      >
        <TextField
          hintText='Just a text..'
          floatingLabelText='Type a message if you want'
          fullWidth
          value={this.state.text}
          onChange={this.onTextChanged}
        />
      </Dialog>
    );
  }
}
