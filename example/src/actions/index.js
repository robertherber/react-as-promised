import Promise from 'bluebird';
import { Manager } from 'react-as-promised';
import SimpleDialog from '../components/SimpleDialog';
import DialogWithText from '../components/DialogWithText';
import DialogWithExternalControl from '../components/DialogWithExternalControl';
import LoadingIndicator from '../components/LoadingIndicator';

Manager.registerComponent('DialogWithExternalControl', DialogWithExternalControl, ['onProceed'], ['onDismiss']);
Manager.registerComponent('LoadingIndicator', LoadingIndicator);

const printResolved = value => console.log('Resolved', value),
      printRejected = error => console.log('Rejected', error.message);

export const ShowAndCancelModal = () => {
  const promise = Manager.present(SimpleDialog)
    .tap(printResolved)
    .tapCatch(printRejected);

  return Promise.delay(2000).then(() => promise.cancel());
};

export const ShowAndCancelLoadingIndicator = () => {
  const promise = Manager.presentRegistered('LoadingIndicator');

  return Promise.delay(2000).then(() => promise.cancel());
};

export const ShowModalWithTimeout = () => Manager.present(SimpleDialog).timeout(5000)
    .tap(printResolved)
    .tapCatch(printRejected);

export const ShowModal = () => Manager.present(SimpleDialog)
    .tap(printResolved)
    .tapCatch(printRejected);

export const ShowTwoModals = () =>
  Manager.present(SimpleDialog)
    .tap(printResolved)
    .tapCatch(printRejected)
    .then(() => Manager.present(SimpleDialog))
    .tap(printResolved)
    .tapCatch(printRejected);

export const ShowDialogWithText = () => Manager.present(DialogWithText)
    .tap(printResolved)
    .tapCatch(printRejected);

export const ShowRegisteredModal = () => {
  const hideDialog = () => {
    // eslint-disable-next-line no-use-before-define
    componentPromise.updateProps({ open: false });
  };

  const props = {
    open: true,
    onDismiss: hideDialog,
    onProceed: hideDialog,
    onCancel: hideDialog,
  };

  const componentPromise = Manager.presentRegistered('DialogWithExternalControl', props)
    .tap(printResolved)
    .tapCatch(printRejected);

  return componentPromise;
};

export const ShowDialogWithCustomCallbacks = () => {
  const hideDialog = () => {
    // eslint-disable-next-line no-use-before-define
    componentPromise.updateProps({ open: false });
  };

  const props = {
    open: true,
    onDismiss: hideDialog,
    onProceed: hideDialog,
  };

  const componentPromise = Manager.present(DialogWithExternalControl, props, 'onProceed', 'onDismiss')
    .tap(printResolved)
    .tapCatch(printRejected);

  return componentPromise;
};
