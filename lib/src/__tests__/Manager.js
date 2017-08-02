import React from 'react';

describe('Manager', () => {
  const firstComponent = <div />,
        secondComponent = <p />;

  let Promise,
      emitter,
      registerComponent,
      presentRegistered,
      present,
      TimeoutError,
      registeredComponents;

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllTimers();
    jest.resetAllMocks();
    jest.useFakeTimers();

    //eslint-disable-next-line
    registerComponent = require('../Manager').registerComponent;
    //eslint-disable-next-line
    present = require('../Manager').present;
    //eslint-disable-next-line
    presentRegistered = require('../Manager').presentRegistered;
    //eslint-disable-next-line
    registeredComponents = require('../Manager').registeredComponents;

    //eslint-disable-next-line
    emitter = require('../emitter').emitter;
    //eslint-disable-next-line
    Promise = require('bluebird');
    TimeoutError = Promise.TimeoutError;

    Promise.config({
      cancellation: true,
    });
  });

  it('Should register component', () => {
    registerComponent('abc', firstComponent);
    expect(registeredComponents.abc).toEqual({
      component: firstComponent,
      resolvers: 'resolve',
      rejecters: 'reject',
    });
  });

  it('Should register component with custom callbacks', () => {
    registerComponent('abc', firstComponent, 'onResolved', 'onRejected');
    expect(registeredComponents.abc).toEqual({
      component: firstComponent,
      resolvers: 'onResolved',
      rejecters: 'onRejected',
    });
  });

  it('Should present component', () => {
    const spyOnEmitter = jest.spyOn(emitter, 'emit');

    const props = { a: 'prop', another: 'prop' },
          promise = present(firstComponent, props);

    expect(promise).toEqual(expect.any(Promise));
    expect(spyOnEmitter).toHaveBeenCalledTimes(1);

    const args = spyOnEmitter.mock.calls[0];
    expect(args[0]).toEqual('presentView');
    expect(args[1]).toEqual(0);
    expect(args[2]).toEqual(firstComponent);
    expect(args[3]).toEqual(props);
    expect(args[4]).toEqual(expect.any(Function));
    expect(args[5]).toEqual(expect.any(Function));
    expect(args[6]).toEqual(expect.any(Function));
  });

  it('Should include onCancel in event if cancellation is on', () => {
    const spyOnEmitter = jest.spyOn(emitter, 'emit');

    Promise.config({
      cancellation: true,
    });

    const props = { a: 'prop', another: 'prop' },
          promise = present(firstComponent, props);

    expect(promise).toEqual(expect.any(Promise));
    expect(spyOnEmitter).toHaveBeenCalledTimes(1);

    const args = spyOnEmitter.mock.calls[0];
    expect(args[0]).toEqual('presentView');
    expect(args[1]).toEqual(0);
    expect(args[2]).toEqual(firstComponent);
    expect(args[3]).toEqual(props);
    expect(args[4]).toEqual(expect.any(Function));
    expect(args[5]).toEqual(expect.any(Function));
    expect(args[6]).toEqual(expect.any(Function));
  });

  it('Should present registered component', () => {
    registerComponent('abc', secondComponent);
    const spyOnEmitter = jest.spyOn(emitter, 'emit');

    const props = { a: 'prop', another: 'prop' },
          promise = presentRegistered('abc', props);

    expect(promise).toEqual(expect.any(Promise));
    expect(spyOnEmitter).toHaveBeenCalledTimes(1);

    const args = spyOnEmitter.mock.calls[0];
    expect(args[0]).toEqual('presentView');
    expect(args[1]).toEqual(0);
    expect(args[2]).toEqual(secondComponent);
    expect(args[3]).toEqual(props);
    expect(args[4]).toEqual(expect.any(Function));
    expect(args[5]).toEqual(expect.any(Function));
  });

  it('Should work with timeout', () => {
    jest.useFakeTimers();

    const promise = present(firstComponent).timeout(1000);

    jest.runOnlyPendingTimers();

    expect(promise).rejects.toEqual(new TimeoutError('operation timed out'));
  });
});
