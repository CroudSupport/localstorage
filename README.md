# Local Storage #

This Html5 local storage wrapper can be used to add some structure to objects saved on the client

### Installation ###

You can install this module using npm

```
#!Command Line

npm install --save git+ssh://git@bitbucket.org:croudtech/localstorage.git
```
 
After this you can import the module like so


```
#!JS

var store = require('localstorage');
```

### Saving and Retrieving Data ###
You can use the set function to save 

```
#!js

store.set('test', {a: 'test'});
```

Use dot notification if you want to extend an object or save to a specific key

```
#!js

store.set('test.b' {c: 'multi-dimensional'})
```

To recall data, you can use the get function

```
#!js

store.get('test.b') //{c: 'multi-dimensional'}
```

Pass a true bool to receive structured meta data, ie created + updated timestamps, type, etc

```
#!js

store.get('test.b', true) //{data: {c: 'multi-dimensional'}, meta:{...}}
```

### Events ###
Events are emitted when data has been updated, you can subscribe to these events on specific keys by using the example below

```
#!js

store.subscribe('test', (e, obj) => {
  console.log('there has been a change...');
  console.log(obj);
});

store.set('test.b.d', 'trigger') //'there has been a change', etc...
```

### Contributing ###

* Make changes in the /src/index.js file
* Run Gulp    

### Who can I talk to? ###

* Brock (Brock.Reece@croud.co.uk)