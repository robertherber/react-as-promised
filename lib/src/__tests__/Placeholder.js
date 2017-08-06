import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
// import ShallowRenderer from 'react-test-renderer/shallow';
// import Promise from 'bluebird';
// import Placeholder from '../Placeholder';
// import { emitter } from '../emitter';

class Speciales extends React.Component {
  render() {
    return <p {...this.props} />;
  }
}


//eslint-disable-next-line
describe.only('Manager', () => {
  let Placeholder,
      Promise,
      emitter;
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllTimers();
    jest.resetAllMocks();


    jest.useFakeTimers();

    //eslint-disable-next-line
    Placeholder = require('../Placeholder').default;
    //eslint-disable-next-line
    emitter = require('../emitter').emitter;
    //eslint-disable-next-line
    Promise = require('bluebird');

    Promise.config({
      cancellation: true,
    });
  });

  afterEach(() => {

  });

  it('Should show component', () => {
    const renderer = ReactTestRenderer.create(<Placeholder />),
          resolvers = ['resolve'],
          rejecters = ['reject'],
          onCancel = () => {},
          reject = () => {},
          resolve = () => {};

    emitter.emit('presentView', 0, Speciales, {}, resolve, reject, onCancel, resolvers, rejecters);

    const content = renderer.toJSON();
    expect(content.type).toEqual('div');
    expect(content.children).toHaveLength(1);
    expect(content.children[0].props.resolve).toEqual(expect.any(Function));
    expect(content.children[0].props.reject).toEqual(expect.any(Function));
    expect(content.children[0].props.onCancel).toEqual(expect.any(Function));
  });

  it('Should show component with custom resolver/rejecter', () => {
    const renderer = ReactTestRenderer.create(<Placeholder />),
          resolvers = ['onResolved'],
          rejecters = ['onRejected'],
          onCancel = () => {},
          reject = () => {},
          resolve = () => {};

    emitter.emit('presentView', 0, Speciales, {}, resolve, reject, onCancel, resolvers, rejecters);

    const content = renderer.toJSON();
    expect(content.type).toEqual('div');
    expect(content.children).toHaveLength(1);
    expect(content.children[0].props.onResolved).toEqual(expect.any(Function));
    expect(content.children[0].props.onRejected).toEqual(expect.any(Function));
    expect(content.children[0].props.onCancel).toEqual(expect.any(Function));
  });

  it('Should remove component when cancelling', () => {
    const component = <Placeholder />,
          resolvers = ['onResolved'],
          rejecters = ['onRejected'],
          noOp = () => {},
          renderer = ReactTestRenderer.create(component),
          promise = new Promise((resolve, reject, onCancel) => {
            emitter.emit('presentView', 0, Speciales, {}, resolve, reject, onCancel, resolvers, rejecters);
          });

    emitter.emit('presentView', 1, Speciales, {}, noOp, noOp, noOp, resolvers, rejecters);
    emitter.emit('presentView', 2, Speciales, {}, noOp, noOp, noOp, resolvers, rejecters);

    const content = renderer.toJSON().children;
    expect(content).toHaveLength(3);

    promise.cancel();

    jest.runAllTimers();

    const newContent = renderer.toJSON().children;
    expect(newContent).toHaveLength(2);
  });
});
