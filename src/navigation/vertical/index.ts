// ** Icon imports
import { Poll } from 'mdi-material-ui'
import AccountCogOutline from 'mdi-material-ui/AccountCogOutline'

// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  return [
    {
      title: 'Survey',
      icon: Poll,
      path: '/survey'
    },
    {
      title: 'Users',
      icon: AccountCogOutline,
      path: '/users'
    }
  ]
}

export default navigation
