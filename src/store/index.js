import { Iterable } from 'immutable';
import {
  configureStore,
  createSerializableStateInvariantMiddleware,
  isPlain,
} from '@reduxjs/toolkit';
import rootReducer from './reducers';
import authMiddleware from './middlewares/authMiddleware';
import syncMiddleware from './middlewares/syncMiddleware';

import {
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import { initStateWithPrevTab } from 'redux-state-sync';

// Augment middleware to consider Immutable.JS iterables serializable
const isSerializable = (value) => Iterable.isIterable(value) || isPlain(value);

const getEntries = (value) =>
  Iterable.isIterable(value) ? value.entries() : Object.entries(value);

const serializableMiddleware = createSerializableStateInvariantMiddleware({
  isSerializable,
  getEntries,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER, 'activeTimer/setFilterSelectedDates'],
        ignoredPaths: ['activeTimer.filterSelectedDates.0.startDate', 'activeTimer.filterSelectedDates.0.endDate', 'payload.0.startDate']
      },
    }).concat(authMiddleware,syncMiddleware),
  serializableMiddleware,
});

if (process.env.NODE_ENV === 'development') {
  module.hot?.accept('./reducers', () => {
    const newRootReducer = require('./reducers').default;
    store.replaceReducer(newRootReducer);
  });
}

initStateWithPrevTab(store);

const persistor = persistStore(store);

export default { store, persistor };
