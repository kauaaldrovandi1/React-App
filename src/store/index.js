import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import persistStore from 'redux-persist/lib/persistStore'

import persistedReducers from './modules/reduxPersist'
import rootReducer from './modules/rootReducer'
import rootSaga from './modules/rootSaga'

const sagaMiddlaware = createSagaMiddleware()
const store = createStore(
  persistedReducers(rootReducer),
  applyMiddleware(sagaMiddlaware),
)

sagaMiddlaware.run(rootSaga)

export const persistor = persistStore(store)
export default store
