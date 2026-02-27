// ** React Import
import { ReactNode, useContext } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box, { BoxProps } from '@mui/material/Box'
import { styled, useTheme } from '@mui/material/styles'
import Typography, { TypographyProps } from '@mui/material/Typography'

// ** Type Import
import { Settings } from 'src/@core/context/settingsContext'

// ** Configs
import themeConfig from 'src/configs/themeConfig'
import Image from 'next/image'
import Logo from '../../../../../../public/images/Sides_Logo.png'
import { AuthContext } from 'src/lib/auth/authContext'
import { useRouter } from 'next/router'

interface Props {
  hidden: boolean
  settings: Settings
  toggleNavVisibility: () => void
  saveSettings: (values: Settings) => void
  verticalNavMenuBranding?: (props?: any) => ReactNode
}

// ** Styled Components
const MenuHeaderWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingRight: theme.spacing(4.5),
  transition: 'padding .25s ease-in-out',
  minHeight: theme.mixins.toolbar.minHeight
}))

const HeaderTitle = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontWeight: 600,
  lineHeight: 'normal',
  textTransform: 'uppercase',
  color: theme.palette.text.primary,
  transition: 'opacity .25s ease-in-out, margin .25s ease-in-out'
}))

const StyledLink = styled('a')({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
  cursor: 'pointer'
})

const VerticalNavHeader = (props: Props) => {
  // ** Props
  const { verticalNavMenuBranding: userVerticalNavMenuBranding } = props

  // ** Hooks
  const theme = useTheme()
  const router = useRouter()
  const { user } = useContext(AuthContext)

  const handleClick = () => {
    if (user) {
      router.push('/survey')
    } else {
      router.push('/')
    }
  }

  return (
    <MenuHeaderWrapper className='nav-header' sx={{ pl: 6 }}>
      {userVerticalNavMenuBranding ? (
        userVerticalNavMenuBranding(props)
      ) : (

        <StyledLink onClick={handleClick}>
          <Image src={Logo} width={30} height={30} />
          <HeaderTitle variant='h6' sx={{ ml: 3 }}>
            {themeConfig.templateName}
          </HeaderTitle>
        </StyledLink>

      )}
    </MenuHeaderWrapper>
  )
}

export default VerticalNavHeader
