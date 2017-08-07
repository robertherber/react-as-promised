# react-as-promised

[Demo in Browser](https://robertherber.github.io/react-as-promised)

## Use case
Sometimes you want to present UI as part of a control flow (for example inside a redux action creator). This can be overly complicated if you trigger one action from multiple places in your application. react-as-promised makes it easier by providing a way to present UI components with a promise handle.

```
import { Manager } from 'react-as-promised';
import ConfirmAgeDialog from './components/ConfirmAgeDialog';

function proceed(userNeedsToConfirmAge){
  if(userNeedsToConfirmAge){
    const componentPromise = Manager.present(ConfirmAgeDialog);

    return componentPromise
      .then((userInput) => {
        console.log('ok!', userInput);
      })
      .catch((error) => {
        console.log('oh no!', error)
      });
  }
}
```

## Placeholder

For react-as-promised to know where in the React render tree to put your component a placeholder needs to be placed somewhere, a good place would probably be inside your redux provider (so you can use smart components) but outside your navigation:

```
import React from 'react';
import { Placeholder } from 'react-as-promised';
//...

class App extends React.Component
{
  render(){
    return <Provider store={store}>
      <Placeholder /> // <-- something like this
      <Router history={history}>
        <Route path="/" component={App}>
          <Route path="foo" component={Foo}/>
          <Route path="bar" component={Bar}/>
        </Route>
      </Router>
    </Provider>
  }
}
```

## Wiring up the props
By default react-as-promised will supply your presented component with the following props, adhering to the underlying [Bluebird](http://bluebirdjs.com/docs/api-reference.html) promise standard:
* resolve - to be called when successful
* reject - to be called when unsuccessful
* onCancel - used so you can clean up the view before it disappears, useful to handle animations etc (requires that you choose to [enable cancellation with Bluebird](http://bluebirdjs.com/docs/api/cancellation.html))

Of course you might want to use your own prop mappings instead - to allow reusing component logic. To use your own prop names supply them as arguments to present:

```
Manager.present(ConfirmAgeDialog, {}, 'onConfirm', 'onDismiss');
Manager.present(ConfirmAgeDialog, {}, ['onConfirm', 'onProceed'], ['onDismiss']); // react-as-promised can treat multiple props as resolvers/rejecters
```

## Registering a component
For reusability react-as-promised allows you to register a component for later use, which enables you to specify the prop name mapping at configuration time:

```
//..at setup..

Manager.registerComponent('ConfirmAgeDialog', ConfirmAgeDialog, 'onConfirm', 'onDismiss');

//..later..

Manager.presentRegistered('ConfirmAgeDialog');
```

## Specify props
We made it easy for you to forward props to the component you're presenting:
```

const props = { isRequired: true, theme: 'the-green-one' };

Manager.present(DialogWithExternalControl, props)
```

## Controlling the component from the outside
It's common for components to be controlled from the outside. For this we added the `updateProps` method on the returned componentPromise:
```
const hideDialog = () => {
  componentPromise.updateProps({ open: false });
};

const props = {
  open: true,
  onDismiss: hideDialog,
  onProceed: hideDialog,
};

const componentPromise = Manager.present(DialogWithExternalControl, props);
return componentPromise;
```
