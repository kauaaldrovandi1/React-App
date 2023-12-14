import React from 'react'
import PropTypes from 'prop-types'
import LoadingIcons from 'react-loading-icons'

import { Container } from './styled'

export default function Loading({ isLoading }) {
  // eslint-disable-next-line react/jsx-no-useless-fragment
  if (!isLoading) return <></>
  return (
    <Container>
      <div />
      <span>
        <LoadingIcons.SpinningCircles speed={2} />
      </span>
    </Container>
  )
}

Loading.defaultProps = {
  isLoading: false,
}

Loading.propTypes = {
  isLoading: PropTypes.bool,
}
