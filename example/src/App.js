import React, { Component } from 'react';
import { Placeholder } from 'react-as-promised';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { FlatButton } from 'material-ui';

import logo from './logo.svg';
import './App.css';
import {
  ShowAndCancelModal,
  ShowModal,
  ShowModalWithTimeout,
  ShowDialogWithText,
  ShowDialogWithCustomCallbacks,
  ShowRegisteredModal,
  ShowTwoModals,
  ShowAndCancelLoadingIndicator,
} from './actions/index';

class App extends Component {
  state = {
    text: '',
  }

  triggerAction(action) {
    return action()
      .then((text) => {
        this.setState({ error: false, text });
      })
      .catch((error) => {
        this.setState({ error: true, text: error.message });
      });
  }

  render() {
    return (
      <MuiThemeProvider>
        <div className='App'>
          <Placeholder />
          <div className='App-header'>
            <h2>Welcome to react-as-promised</h2>
          </div>
          <FlatButton primary onClick={() => this.triggerAction(ShowAndCancelLoadingIndicator)} label='Show loading indicator for 2s' />
          <FlatButton primary onClick={() => this.triggerAction(ShowAndCancelModal)} label='Show modal and cancel promise after 2s' />
          <FlatButton primary onClick={() => this.triggerAction(ShowModalWithTimeout)} label='Show modal with 5s timeout' />
          <FlatButton primary onClick={() => this.triggerAction(ShowModal)} label='Show modal' />
          <FlatButton primary onClick={() => this.triggerAction(ShowDialogWithText)} label='Show dialog with text' />
          <FlatButton primary onClick={() => this.triggerAction(ShowDialogWithCustomCallbacks)} label='Show dialog with custom callbacks' />
          <FlatButton primary onClick={() => this.triggerAction(ShowRegisteredModal)} label='Show registered modal' />
          <FlatButton primary onClick={() => this.triggerAction(ShowTwoModals)} label='Show TWO modals' />
          <p style={{ color: this.state.error ? 'red' : 'black' }}>{ this.state.text }</p>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
