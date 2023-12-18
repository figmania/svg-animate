import { Button, useConfig } from '@figmania/ui'
import { FunctionComponent } from 'react'
import { Config } from '../Schema'
import { FIGMANIA_HOST } from '../utils/contants'
import { shared } from '../utils/styles'

export const AccountScreen: FunctionComponent = () => {
  const [config, saveConfig] = useConfig<Config>()
  return (
    <div className={shared('screen')}>
      <Button label="Login" onClick={() => {
        saveConfig({ user: undefined })
        fetch(`https://${FIGMANIA_HOST}/api/authSessions/create/${config.userId}`, { method: 'POST' }).then((response) => response.json()).then(({ readKey, writeKey }) => {
          const interval = setInterval(() => {
            fetch(`https://${FIGMANIA_HOST}/api/authSessions/poll/${readKey}`, { method: 'GET' })
              .then((response) => response.json())
              .then(({ complete, user }) => {
                if (!complete || !user) { return }
                saveConfig({ user })
                clearInterval(interval)
              })
          }, 5000)
          console.info(`https://www.figmania.dev/authSession/${writeKey}`)
          // window.open(`https://www.figmania.dev/authSession/${writeKey}`, 'authWindow', 'popup=1,width=320,height=480')
        })
      }} />
      {config.user && (
        <div>
          <p>Name: {config.user.name}</p>
          <p>Email: {config.user.email}</p>
          <p>Access Token: {config.user.accessToken}</p>
          <p>Refresh Token: {config.user.refreshToken}</p>
        </div>
      )}
    </div>
  )
}
