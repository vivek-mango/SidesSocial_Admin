import { useContext, useEffect, useState } from 'react'
import { AuthContext } from './authContext'

export const withAuth = Component => {
  const AuthRoute = props => {
    const { user } = useContext(AuthContext)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
      const checkUser = async () => {
        if (user) {
          setIsLoading(false)
        } else {
          const interval = setInterval(() => {
            if (user) {
              setIsLoading(false)
              clearInterval(interval)
            }
          }, 100)
        }
      }

      checkUser()
    }, [user])

    if (isLoading) {
      return null
    }

    if (!user) {
      if (typeof window !== 'undefined') window.location.replace('/')
      return null
    }

    return <Component {...props} />
  }

  return AuthRoute
}
