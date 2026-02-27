// ** React Imports
import { useState, SyntheticEvent, useEffect, useContext, ChangeEvent } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Alert from '@mui/material/Alert'
import TextField from '@mui/material/TextField'
import AlertTitle from '@mui/material/AlertTitle'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'

// ** Icons Imports
import Close from 'mdi-material-ui/Close'
import { withAuth } from 'src/lib/auth/withAuth'
import { AuthContext } from 'src/lib/auth/authContext'
import apolloClient from 'src/lib/auth/apollo'
import { GET_USER_BY_ID, UPDATE_USER_DETAILS, } from 'src/lib/auth/graphql'
import toast from 'react-hot-toast'

interface UserDetails {
  first_name: string
  last_name: string
  email: string
}

const TabAccount = () => {
  // ** State

  const { user } = useContext(AuthContext)
  const [userDetails, setUserDetails] = useState<UserDetails>({
    first_name: '',
    last_name: '',
    email: ''
  })

  useEffect(() => {
    getUserDetails()
  }, [])

  const getUserDetails = async () => {
    try {
      const { data } = await apolloClient.query({
        query: GET_USER_BY_ID,
        variables: {
          getUserById: user.id
        }
      })


      setUserDetails(data.getUserById)

    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUserDetails({
      ...userDetails,
      [event.target.name]: event.target.value
    })
  }

  const handleChangeDetails = async () => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: UPDATE_USER_DETAILS,
        variables: {
          updateUserData: {
            id: user.id,
            first_name: userDetails.first_name,
            last_name: userDetails.last_name,
            email: userDetails.email
          }
        }
      })
      if (data && data?.updateUser) {
        toast.success('User details updated successfully')
        await getUserDetails()
      }
    } catch (error: any) {
      toast.error(error.message)
    }
  }


  const resetForm = async () => {
    await getUserDetails()
  }

  return (
    <CardContent>
      <form>
        <Grid container spacing={7}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='First Name'
              name='first_name'
              value={userDetails.first_name}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth
              label='Last Name'
              name='last_name'
              value={userDetails.last_name}
              onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type='email'
              label='Email'
              name='email'
              value={userDetails.email}
              onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField disabled fullWidth label='Role' placeholder='Admin' defaultValue='Admin' />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField disabled fullWidth label='Status' placeholder='Active' defaultValue='Active' />
          </Grid>



          <Grid item xs={12}>
            <Button variant='contained' sx={{ marginRight: 3.5 }} onClick={handleChangeDetails}>
              Save Changes
            </Button>
            <Button type='reset' variant='outlined' color='secondary' onClick={resetForm}>
              Reset
            </Button>
          </Grid>
        </Grid>
      </form>
    </CardContent>
  )
}

export default withAuth(TabAccount)
