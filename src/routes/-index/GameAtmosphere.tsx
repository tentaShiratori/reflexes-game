import styled from 'styled-components'
import { atmosphereBase } from './atmosphereBase'

export const GameAtmosphere = styled.div.attrs({ 'aria-hidden': true })`
  ${atmosphereBase}
  background:
    radial-gradient(circle at 12% 18%, rgba(15, 143, 123, 0.22), transparent 34%),
    radial-gradient(circle at 88% 12%, rgba(217, 119, 6, 0.18), transparent 30%),
    linear-gradient(160deg, #eef5fa 0%, #f7fafc 42%, #e7f2ef 100%);
`
