import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { isEmail } from 'validator'
import { useSelector, useDispatch } from 'react-redux'

import * as actions from '../../store/modules/auth/actions'
import { Form } from './styled'
import { Container } from '../../styles/GlobalStyle'

import Loading from '../../components/Loading'

export default function Register() {
  const dispatch = useDispatch()

  const id = useSelector(state => state.auth.user.id)
  const nomeStored = useSelector(state => state.auth.user.nome)
  const emailStored = useSelector(state => state.auth.user.email)
  const isLoading = useSelector(state => state.auth.isLoading)

  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  React.useEffect(() => {
    if (!id) return

    setNome(nomeStored)
    setEmail(emailStored)
  }, [emailStored, id, nomeStored])

  async function handleSubmit(e) {
    e.preventDefault()
    let formErrors = false

    if (nome.length < 3 || nome.length > 255) {
      formErrors = true
      toast.error('Nome deve ter entre 3 e 255 caracteres')
    }

    if (!isEmail(email)) {
      formErrors = true
      toast.error('Email inválido')
    }

    if (!id && (password.length < 6 || password.length > 50)) {
      formErrors = true
      toast.error('Senha deve ter entre 6 e 50 caracteres')
    }

    if (formErrors) return

    dispatch(actions.registerRequest({ id, nome, password, email }))
  }

  return (
    <Container>
      <Loading isLoading={isLoading} />
      <h1>{id ? 'Editar Dados' : 'Crie sua conta'}</h1>

      <Form onSubmit={handleSubmit}>
        <label htmlFor="nome">
          Nome
          <input
            type="text"
            value={nome}
            onChange={e => setNome(e.target.value)}
            placeholder="Nome"
          />
        </label>

        <label htmlFor="email">
          E-mail
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

        <button type="submit">{id ? 'Salvar' : 'Criar conta'}</button>
      </Form>
    </Container>
  )
}
