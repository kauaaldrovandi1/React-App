import { call, put, all, takeLatest } from 'redux-saga/effects'
import { toast } from 'react-toastify'
import { get } from 'lodash'

import axios from '../../../services/axios'
import history from '../../../services/history'
import * as actions from './actions'
import * as types from '../types'

function* loginRequest({ payload }) {
  try {
    const response = yield call(axios.post, '/tokens/', payload)
    yield put(actions.loginSuccess({ ...response.data }))

    toast.success('Login efetuado com sucesso')

    axios.defaults.headers.Authorization = `Bearer ${response.data.token}`
    history.push(payload.prevPath)
  } catch (e) {
    toast.error('Usuário ou senha inválidos')

    yield put(actions.loginFailure())
  }
}

function persistRehydrate({ payload }) {
  const token = get(payload, 'auth.token', '')
  if (!token) return
  axios.defaults.headers.Authorization = `Bearer ${token}`
}

// eslint-disable-next-line consistent-return
function* registerRequest({ payload }) {
  const { id, nome, email, password } = payload

  try {
    if (id) {
      yield call(axios.put, '/users', {
        email,
        nome,
        password: password || undefined,
      })
      toast.success('Usuário alterado com sucessso')
      yield put(actions.registerUpdatedSuccess({ nome, email, password }))
    } else {
      yield call(axios.post, '/users', {
        email,
        nome,
        password,
      })
      toast.success('Usuário criado com sucessso')
      yield put(actions.registerCreatedSuccess())
      history.push('/login')
    }
  } catch (e) {
    const errors = get(e, 'response.data.errors', [])
    const status = get(e, 'response.status', 0)
    if (status === 401) {
      toast.error('Necessário fazer login novamente')
      yield put(actions.loginFailure())
      return history.push('/login')
    }

    if (errors.length > 0) {
      errors.map(error => toast.error(error))
    } else {
      toast.error('Erro desconhecido')
    }

    yield put(actions.registerFailure())
  }
}

export default all([
  takeLatest(types.LOGIN_REQUEST, loginRequest),
  takeLatest(types.PERSIST_REHYDRATE, persistRehydrate),
  takeLatest(types.REGISTER_REQUEST, registerRequest),
])
