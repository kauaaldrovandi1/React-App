import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { isEmail } from 'validator'
import { useDispatch, useSelector } from 'react-redux'
import { get } from 'lodash'

import { Container } from '../../styles/GlobalStyle'
import { Form } from './styled'
import * as actions from '../../store/modules/auth/actions'

import Loading from '../../components/Loading'

export default function Login(props) {
  const dispatch = useDispatch()

  const prevPath = get(props, 'location.state.prevPath', '/')

  const isLoading = useSelector(state => state.auth.isLoading)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    let formErrors = false

    if (!isEmail(email)) {
      formErrors = true
      toast.error('Email inválido')
    }

    if (password.length < 6 || password.length > 50) {
      formErrors = true
      toast.error('Senha Inválida')
    }

    if (formErrors) return

    dispatch(actions.loginRequest({ email, password, prevPath }))
  }

  return (
    <Container>
      <Loading isLoading={isLoading} />
      <h1>Faça seu login</h1>

      <Form onSubmit={handleSubmit}>
        <label htmlFor="email">
          Email
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="E-mail"
          />
        </label>

        <label htmlFor="senha">
          Senha
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Senha"
          />
        </label>

        <button type="submit">Entrar</button>
      </Form>
    </Container>
  )
}
