/* @flow */

import Promise from 'bluebird';

import { emitter } from './emitter';

export const registeredComponents = {};

let counter = 0;

const createComponentPromise = (
  id: number,
  component: ?React$Element<any>,
  props: Object,
  resolvers: string | Array<string> = 'resolve',
  rejecters: string | Array<string> = 'reject'
) => {
  const resolversArray = typeof (resolvers) === 'string' ? [resolvers] : resolvers,
        rejectersArray = typeof (rejecters) === 'string' ? [rejecters] : rejecters;

  const promise = new Promise((resolve, reject, onCancel) => {
    emitter.emit('presentView', id, component, props, resolve, reject, onCancel, resolversArray, rejectersArray);
  });
  // eslint-disable-next-line no-proto
  promise.__proto__.updateProps = (newProps) => {
    emitter.emit('updateProps', id, newProps);
  };
  return promise;
};

const getIdAndIncrementCounter = () => {
  const id = counter;
  counter += 1;
  return id;
};

export const present = (
  component: ?React$Element<any>,
  props: Object = {},
  resolvers: string | Array<string> = 'resolve',
  rejecters: string | Array<string> = 'reject'
) => {
  if (typeof (component) === 'string') {
    return Promise.reject(new Error(`Got string, expected component. Use registerComponent to present a registered component.`));
  }

  const id = getIdAndIncrementCounter();

  return createComponentPromise(id, component, props, resolvers, rejecters);
};

export const presentRegistered = (componentId: string, props: Object = {}) => {
  if (!registeredComponents[componentId]) {
    return Promise.reject(new Error(`Component "${componentId}" has not been registered, make sure you register it before calling presentRegistered`));
  }

  const { component, resolvers, rejecters } = registeredComponents[componentId],
        id = getIdAndIncrementCounter();

  return createComponentPromise(id, component, props, resolvers, rejecters);
};

export const registerComponent = (
  id: string,
  component: ?React$Element<any>,
  resolvers: string | Array<string> = 'resolve',
  rejecters: string | Array<string> = 'reject'
) => {
  registeredComponents[id] = { component, resolvers, rejecters };
};

export default {
  present,
  registerComponent,
  presentRegistered,
};
