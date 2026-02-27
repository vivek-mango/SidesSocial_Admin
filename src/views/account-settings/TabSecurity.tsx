// ** React Imports
import { ChangeEvent, MouseEvent, useContext, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputAdornment from '@mui/material/InputAdornment'

// ** Icons Imports
import EyeOutline from 'mdi-material-ui/EyeOutline'
import KeyOutline from 'mdi-material-ui/KeyOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'
import LockOpenOutline from 'mdi-material-ui/LockOpenOutline'
import apolloClient from 'src/lib/auth/apollo'
import { CHANGE_PASSWORD } from 'src/lib/auth/graphql'
import { Email } from 'mdi-material-ui'
import toast from 'react-hot-toast'
import { AuthContext } from 'src/lib/auth/authContext'

interface State {
  newPassword: string
  currentPassword: string
  showNewPassword: boolean
  confirmNewPassword: string
  showCurrentPassword: boolean
  showConfirmNewPassword: boolean
}

const TabSecurity = () => {
  // ** States
  const [values, setValues] = useState<State>({
    newPassword: '',
    currentPassword: '',
    showNewPassword: false,
    confirmNewPassword: '',
    showCurrentPassword: false,
    showConfirmNewPassword: false
  })

  const [errors, setErrors] = useState<{
    currentPassword: string
    newPassword: string
    confirmNewPassword: string
  }>({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  })

  const { user } = useContext(AuthContext)
  // Handle Current Password
  const handleCurrentPasswordChange = (prop: keyof State) => (event: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value })
    setErrors({ ...errors, currentPassword: '' })
  }
  const handleClickShowCurrentPassword = () => {
    setValues({ ...values, showCurrentPassword: !values.showCurrentPassword })
  }
  const handleMouseDownCurrentPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  // Handle New Password
  const handleNewPasswordChange = (prop: keyof State) => (event: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value })
    setErrors({ ...errors, newPassword: '' })
  }
  const handleClickShowNewPassword = () => {
    setValues({ ...values, showNewPassword: !values.showNewPassword })
  }
  const handleMouseDownNewPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  // Handle Confirm New Password
  const handleConfirmNewPasswordChange = (prop: keyof State) => (event: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value })
    setErrors({ ...errors, confirmNewPassword: '' })
  }
  const handleClickShowConfirmNewPassword = () => {
    setValues({ ...values, showConfirmNewPassword: !values.showConfirmNewPassword })
  }
  const handleMouseDownConfirmNewPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }


  const handleChangePassword = async () => {
    try {
      let isValid = true
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>?]).{7,}$/

      if (!values.currentPassword) {
        setErrors(prevErrors => ({ ...prevErrors, currentPassword: 'Current password is required' }))
        isValid = false
      }

      if (!values.newPassword) {
        setErrors(prevErrors => ({ ...prevErrors, newPassword: 'New password is required' }))
        isValid = false
      } else if (!passwordRegex.test(values.newPassword)) {
        setErrors(prevErrors => ({
          ...prevErrors,
          newPassword: 'New password must be at least 8 characters long and contain at least one capital letter, one number, and one special character'
        }))
        isValid = false
      }

      if (!values.confirmNewPassword) {
        setErrors(prevErrors => ({ ...prevErrors, confirmNewPassword: 'Confirm new password is required' }))
        isValid = false
      } else if (values.newPassword !== values.confirmNewPassword) {
        setErrors(prevErrors => ({ ...prevErrors, confirmNewPassword: 'New password and confirm new password do not match' }))
        isValid = false
      }

      if (!isValid) return

      const { data } = await apolloClient.mutate({
        mutation: CHANGE_PASSWORD,
        variables: {
          changePasswordInput: {
            email: user.email,
            old_password: values.currentPassword,
            password: values.newPassword,
          }
        }
      })

      if (data && data?.changepasssword
      ) {
        setValues({ ...values, currentPassword: '', newPassword: '', confirmNewPassword: '' })
        toast.success(data?.changepasssword
          .message)
      }
    } catch (error: any) {
      toast.error(error.message)
    }

  }

  return (
    <form>
      <CardContent sx={{ paddingBottom: 0 }}>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={6}>
            <Grid container spacing={5}>
              <Grid item xs={12} sx={{ marginTop: 4.75 }}>
                <FormControl fullWidth>
                  <InputLabel htmlFor='account-settings-current-password'>Current Password</InputLabel>
                  <OutlinedInput
                    label='Current Password'
                    value={values.currentPassword}
                    id='account-settings-current-password'
                    type={values.showCurrentPassword ? 'text' : 'password'}
                    onChange={handleCurrentPasswordChange('currentPassword')}
                    error={!!errors.currentPassword}
                    endAdornment={
                      <InputAdornment position='end'>
                        <IconButton
                          edge='end'
                          aria-label='toggle password visibility'
                          onClick={handleClickShowCurrentPassword}
                          onMouseDown={handleMouseDownCurrentPassword}
                        >
                          {values.showCurrentPassword ? <EyeOutline /> : <EyeOffOutline />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                  {errors.currentPassword && <Typography variant='caption' color='error'>{errors.currentPassword}</Typography>}
                </FormControl>
              </Grid>

              <Grid item xs={12} sx={{ marginTop: 6 }}>
                <FormControl fullWidth>
                  <InputLabel htmlFor='account-settings-new-password'>New Password</InputLabel>
                  <OutlinedInput
                    label='New Password'
                    value={values.newPassword}
                    id='account-settings-new-password'
                    onChange={handleNewPasswordChange('newPassword')}
                    type={values.showNewPassword ? 'text' : 'password'}
                    error={!!errors.newPassword}
                    endAdornment={
                      <InputAdornment position='end'>
                        <IconButton
                          edge='end'
                          onClick={handleClickShowNewPassword}
                          aria-label='toggle password visibility'
                          onMouseDown={handleMouseDownNewPassword}
                        >
                          {values.showNewPassword ? <EyeOutline /> : <EyeOffOutline />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />

                  {errors.newPassword && <Typography variant='caption' color='error'>{errors.newPassword}</Typography>}

                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel htmlFor='account-settings-confirm-new-password'>Confirm New Password</InputLabel>
                  <OutlinedInput
                    label='Confirm New Password'
                    value={values.confirmNewPassword}
                    id='account-settings-confirm-new-password'
                    type={values.showConfirmNewPassword ? 'text' : 'password'}
                    onChange={handleConfirmNewPasswordChange('confirmNewPassword')}
                    error={!!errors.confirmNewPassword}
                    endAdornment={
                      <InputAdornment position='end'>
                        <IconButton
                          edge='end'
                          aria-label='toggle password visibility'
                          onClick={handleClickShowConfirmNewPassword}
                          onMouseDown={handleMouseDownConfirmNewPassword}
                        >
                          {values.showConfirmNewPassword ? <EyeOutline /> : <EyeOffOutline />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                  {errors.confirmNewPassword && <Typography variant='caption' color='error'>{errors.confirmNewPassword}</Typography>}
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
        </Grid>


        <Box sx={{ mt: 11 }}>
          <Button variant='contained' sx={{ marginRight: 3.5 }} onClick={handleChangePassword}>
            Save Changes
          </Button>
          <Button
            type='reset'
            variant='outlined'
            color='secondary'
            onClick={() => setValues({ ...values, currentPassword: '', newPassword: '', confirmNewPassword: '' })}
          >
            Reset
          </Button>
        </Box>
      </CardContent>
    </form>
  )
}
export default TabSecurity
