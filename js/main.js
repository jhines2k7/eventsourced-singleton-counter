'use strict';

import Storage from './storage'
import reduce from './reducer'
import EventStore from './eventStore'
import postal from 'postal/lib/postal.lodash'

let eventStore = null;

document.getElementById('increment').addEventListener('click', function( event ) {
    eventStore.add(eventStore.events, [{
        channel: 'async',
        topic: 'myapp.increment.count',
    }]);
}, false);

document.getElementById('decrement').addEventListener('click', function( event ) {
    eventStore.add(eventStore.events, [{
        channel: 'async',
        topic: 'myapp.decrement.count',
    }]);
}, false);

postal.subscribe({
    channel: 'async',
    topic: 'myapp.increment.count',
    callback: function(data, envelope) {
        let state = reduce(eventStore.events);

        document.getElementById('total').innerHTML = state.total
    }.bind(this)
});

postal.subscribe({
    channel: 'async',
    topic: 'myapp.decrement.count',
    callback: function(data, envelope) {
        let state = reduce(eventStore.events);

        document.getElementById('total').innerHTML = state.total
    }.bind(this)
});

Storage.get().then( (events) => {
    eventStore = new EventStore(events);

    let state = reduce(eventStore.events);

    document.getElementById('total').innerHTML = state.total
});
