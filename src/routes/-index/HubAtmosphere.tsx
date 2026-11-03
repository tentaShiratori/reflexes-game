import styled from 'styled-components'
import { atmosphereBase } from './atmosphereBase'

export const HubAtmosphere = styled.div.attrs({ 'aria-hidden': true })`
  ${atmosphereBase}
  background:
    radial-gradient(circle at 18% 22%, rgba(15, 143, 123, 0.26), transparent 36%),
    radial-gradient(circle at 82% 18%, rgba(217, 119, 6, 0.2), transparent 32%),
    radial-gradient(circle at 50% 88%, rgba(16, 35, 63, 0.08), transparent 42%),
    linear-gradient(160deg, #eef5fa 0%, #f7fafc 42%, #e7f2ef 100%);
`
