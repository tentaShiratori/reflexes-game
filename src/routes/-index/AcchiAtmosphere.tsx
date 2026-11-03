import styled from 'styled-components'
import { atmosphereBase } from './atmosphereBase'

export const AcchiAtmosphere = styled.div.attrs({ 'aria-hidden': true })`
  ${atmosphereBase}
  background:
    radial-gradient(circle at 14% 16%, rgba(217, 119, 6, 0.24), transparent 34%),
    radial-gradient(circle at 86% 14%, rgba(15, 143, 123, 0.2), transparent 30%),
    linear-gradient(155deg, #f7f3ea 0%, #f8fafc 48%, #eaf4f1 100%);
`
