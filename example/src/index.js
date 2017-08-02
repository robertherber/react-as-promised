import React from 'react';
import ReactDOM from 'react-dom';
// import injectTapEventPlugin from 'react-tap-event-plugin';
import Promise from 'bluebird';

import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

// injectTapEventPlugin();

Promise.config({
  cancellation: true,
});

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
