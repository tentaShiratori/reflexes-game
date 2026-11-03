import { GameBrand } from './GameBrand'
import { GameShell } from './GameShell'
import { HubAtmosphere } from './HubAtmosphere'
import { HubMenu } from './HubMenu'
import { HubStage } from './HubStage'

export function HubHome() {
  return (
    <GameShell>
      <HubAtmosphere />
      <HubStage>
        <GameBrand title="Reflex Drill" lead="反射で答えろ。遅れて出る合図に間に合うか。" />
        <HubMenu />
      </HubStage>
    </GameShell>
  )
}
