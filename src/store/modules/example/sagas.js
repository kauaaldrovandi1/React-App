import { call, put, all, takeLatest } from 'redux-saga/effects'

import { toast } from 'react-toastify'
import * as actions from './actions'
import * as types from '../types'

const req = () =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, 500)
  })

function* exampleRequest() {
  try {
    yield call(req)
    yield put(actions.clicaBotaoSuccess())
  } catch (e) {
    toast.error('Erro')
    yield put(actions.clicaBotaoFailure())
  }
}
export default all([takeLatest(types.BOTAO_CLICADO_REQUEST, exampleRequest)])
