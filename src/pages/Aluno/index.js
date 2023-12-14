import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom/cjs/react-router-dom'
import { get } from 'lodash'
import { isEmail, isInt, isFloat } from 'validator'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { FaUserCircle, FaEdit } from 'react-icons/fa'

import axios from '../../services/axios'
import history from '../../services/history'
import * as actions from '../../store/modules/auth/actions'
import { Container } from '../../styles/GlobalStyle'
import { Form, ProfilePicture, Title } from './styled'
import Loading from '../../components/Loading'

export default function Aluno({ match }) {
  const dispatch = useDispatch()

  const id = get(match, 'params.id', '')
  const [nome, setNome] = useState('')
  const [sobrenome, setSobrenome] = useState('')
  const [email, setEmail] = useState('')
  const [idade, setIdade] = useState('')
  const [peso, setPeso] = useState('')
  const [altura, setAltura] = useState('')
  const [foto, setFoto] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!id) return

    async function getData() {
      try {
        setIsLoading(true)
        const { data } = await axios.get(`/alunos/${id}`)
        const Foto = get(data, 'Fotos[0].url', '')

        setFoto(Foto)

        setNome(data.nome)
        setSobrenome(data.sobrenome)
        setEmail(data.email)
        setIdade(data.idade)
        setPeso(data.peso)
        setAltura(data.altura)

        setIsLoading(false)
      } catch (err) {
        setIsLoading(false)
        const status = get(err, 'response.status', 0)
        const errors = get(err, 'response.data.errors', [])

        if (status === 400) {
          errors.map(error => toast.error(error))
          history.push('/')
        }
      }
    }

    getData()
  }, [id])

  async function handleSubmit(e) {
    e.preventDefault()
    let formErrors = false

    if (nome.length < 3 || nome.length > 255) {
      formErrors = true
      toast.error('Nome deve conter pelo menos 3 caracteres!')
    }

    if (sobrenome.length < 3 || sobrenome.length > 255) {
      formErrors = true
      toast.error('Sobrenome deve conter pelo menos 3 caracteres!')
    }

    if (!isEmail(email)) {
      formErrors = true
      toast.error('Email Inválido!')
    }

    if (!isInt(String(idade))) {
      formErrors = true
      toast.error('Idade inválida')
    }

    if (!isFloat(String(peso))) {
      formErrors = true
      toast.error('Peso inválido')
    }

    if (!isFloat(String(altura))) {
      formErrors = true
      toast.error('Altura inválida')
    }

    if (formErrors) return

    try {
      setIsLoading(true)
      if (id) {
        await axios.put(`/alunos/${id}`, {
          nome,
          sobrenome,
          email,
          idade,
          peso,
          altura,
        })
        toast.success('Aluno(a) editado(a) com sucesso!')
      } else {
        await axios.post(`/alunos/`, {
          nome,
          sobrenome,
          email,
          idade,
          peso,
          altura,
        })
        toast.success('Aluno(a) criado(a) com sucesso!')
        history.push('/')
      }
      setIsLoading(false)
    } catch (err) {
      const status = get(err, 'response.status', 0)
      const data = get(err, 'response.data', [])
      const errors = get(data, 'errors', [])

      if (errors.length > 0) {
        errors.map(error => toast.error(error))
      } else {
        toast.error('Erro desconhecido')
      }

      if (status === 401) dispatch(actions.loginFailure())

      setIsLoading(false)
    }
  }

  return (
    <Container>
      <Title>{id ? 'Editar Aluno' : 'Novo Aluno'}</Title>

      {id && (
        <ProfilePicture>
          {foto ? <img src={foto} alt={nome} /> : <FaUserCircle size={180} />}
          <Link to={`/fotos/${id}`}>
            <FaEdit />
          </Link>
        </ProfilePicture>
      )}

      <Loading isLoading={isLoading} />

      <Form onSubmit={handleSubmit}>
        <input
          type="text"
          value={nome}
          onChange={e => setNome(e.target.value)}
          placeholder="Nome"
        />

        <input
          type="text"
          value={sobrenome}
          onChange={e => setSobrenome(e.target.value)}
          placeholder="Sobrenome"
        />

        <input
          type="text"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="E-mail"
        />

        <input
          type="number"
          value={idade}
          onChange={e => setIdade(e.target.value)}
          placeholder="Idade"
        />

        <input
          type="number"
          value={peso}
          onChange={e => setPeso(e.target.value)}
          placeholder="Peso"
        />

        <input
          type="number"
          value={altura}
          onChange={e => setAltura(e.target.value)}
          placeholder="Altura"
        />

        <button type="submit">Enviar</button>
      </Form>
    </Container>
  )
}

Aluno.propTypes = {
  match: PropTypes.shape({}).isRequired,
}
