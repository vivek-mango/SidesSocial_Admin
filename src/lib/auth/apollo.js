import { ApolloClient, InMemoryCache } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { Cookies } from 'react-cookie'
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs'
import themeConfig from '../../configs/themeConfig'

const httpLink = createUploadLink({
  uri: themeConfig.graphQLEndPoint + 'graphql'
})

// Set up the context to include the x-access-token header
const authLink = setContext((_, { headers }) => {
  const getCookies = new Cookies()
  const token = getCookies.cookies.auth

  return {
    headers: {
      ...headers,
      'x-access-token': token ? token : '',
      'apollo-require-preflight': true
    }
  }
})

const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
})

export default apolloClient
