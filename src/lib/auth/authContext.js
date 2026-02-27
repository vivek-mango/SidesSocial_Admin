import { createContext, useState, useEffect } from 'react'
import { useCookies } from 'react-cookie'
import apolloClient from './apollo'
import { GET_USER_DETAIL_BY_TOKEN, LOGIN_MUTATION } from './graphql'
import { useRouter } from 'next/router'
import { toast } from 'react-hot-toast'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [cookies, setCookie, removeCookie] = useCookies(['auth'])
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      const token = cookies.auth

      try {
        const { data } = await apolloClient.query({
          query: GET_USER_DETAIL_BY_TOKEN,
          variables: {
            loginToken: token
          }
        })
        const userInfo = JSON.parse(data.getUserDetailsByToken)
        setUser(userInfo)
      } catch (error) {
        toast.error(error.message)
      }
    }

    if (cookies.auth) {
      fetchUser()
    }
  }, [cookies.auth])

  const login = async (email, password) => {
    try {
      const loginInput = { email, password }
      const { data } = await apolloClient.mutate({
        mutation: LOGIN_MUTATION,
        variables: { loginInput }
      })

      setCookie('auth', data.login.token, { path: '/' })
      toast.success('Login Successfully')
      setTimeout(() => {
        router.push('/survey')
      }, 3000)
    } catch (error) {
      toast.error(error.message)
    }
  }

  const logout = () => {
    removeCookie('auth', { path: '/' })
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}
