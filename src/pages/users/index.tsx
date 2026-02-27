// ** React Imports
import { useState, ChangeEvent, useEffect, SyntheticEvent } from 'react'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TablePagination from '@mui/material/TablePagination'
import { Box, Grid, IconButton, InputAdornment, Tab, Tabs, TextField, Typography } from '@mui/material'
import { withAuth } from 'src/lib/auth/withAuth'
import toast from 'react-hot-toast'
import { Delete, Pencil } from 'mdi-material-ui'
import { Search } from '@mui/icons-material'
import styles from "../../../styles/Survey.module.css"
import apolloClient from 'src/lib/auth/apollo'
import { DELETE_USER, GET_USERS_LIST, GET_USER_ROLE_COUNT } from 'src/lib/auth/graphql'
import router from 'next/router'

interface Role {
  role: string
}

interface Users {
  id: number
  first_name: string
  last_name: string
  email: string | null
  status: string | null
  role: Role
  created_at: string
}

interface Column {
  id: 'id' | 'first_name' | 'email' | 'status' | 'role' | 'action'
  label: string
  minWidth?: number
  align?: 'right'
  format?: (value: number) => string
}

const columns: readonly Column[] = [
  { id: 'id', label: 'ID', minWidth: 100 },
  { id: 'first_name', label: 'Name', minWidth: 170 },
  { id: 'email', label: 'Email', minWidth: 200 },
  { id: 'status', label: 'Status', minWidth: 200 },
  { id: 'role', label: 'Role', minWidth: 100 },
  { id: 'action', label: 'Action', minWidth: 100 }

]

const UserList = () => {
  // ** States
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(10)
  const [users, setUsers] = useState<Users[]>([])
  const [selectedTab, setSelectedTab] = useState<string>('all')
  const [totalCountUsers, setTotalCountUsers] = useState<number>(0)
  const [roleCount, setRoleCount] = useState<{ totalCount: number, adminCount: number, userCount: number }>({ totalCount: 0, adminCount: 0, userCount: 0 })
  const [currentPageUsers, setCurrentPageUsers] = useState<number>(0)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchUsersList()
  }, [page, limit, searchTerm, selectedTab])


  useEffect(() => {
    fetchRoleCount()
  }, [searchTerm])


  const fetchUsersList = async () => {
    try {
      const { data } = await apolloClient.query({
        query: GET_USERS_LIST,
        variables: {
          page: page,
          limit: limit,
          search: searchTerm,
          sortBy: "created_at",
          sortOrder: "DESC",
          filterByRole: selectedTab === 'admin'
            ? 'admin'
            : selectedTab === 'user'
              ? 'user'
              : null,
        }
      })
      const { currentPage, totalCount, totalPages } = data.getUsers
      setUsers(JSON.parse(data.getUsers.data))
      setTotalCountUsers(totalCount)
      setCurrentPageUsers(currentPage)
    } catch (error: any) {
      toast.error(error.message)
    }
  }



  const fetchRoleCount = async () => {
    try {
      const { data } = await apolloClient.query({
        query: GET_USER_ROLE_COUNT,
        variables: {
          search: searchTerm
        }
      })
      const parseData = JSON.parse(data.userRoleCounts)
      setRoleCount(parseData)
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const handleDeleteUser = async (id: number) => {

    try {
      const { data } = await apolloClient.query({
        query: DELETE_USER,
        variables: {
          deleteUserId: id
        }
      })
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));

      setTimeout(async () => {
        fetchRoleCount()
        toast.success("user deleted successfully")
      }, 1000)
    } catch (error: any) {
      toast.error(error.message)
    }
  }


  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage + 1)
    fetchUsersList()
  }

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setLimit(parseInt(event.target.value, 10))
    setPage(1)
    fetchUsersList()
  }

  const handleTabChange = (event: SyntheticEvent, newValue: string) => {
    setSelectedTab(newValue)
    fetchUsersList()
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} className={styles.gridcss} >
        <Typography variant='h5' sx={{ color: 'primary.main' }}>
          Users
        </Typography>

      </Grid>
      <Grid item xs={12}>
        <Box display='flex' alignItems='center'>
          <Box flex={1}>
            <Tabs value={selectedTab} onChange={handleTabChange} aria-label='survey status tabs'>
              <Tab label={`All (${roleCount.totalCount})`} value='all' />
              <Tab label={`User (${roleCount.userCount || 0})`} value='user' />
              <Tab label={`Admin (${roleCount.adminCount || 0})`} value='admin' />
            </Tabs>
          </Box>
          <Box>
            <TextField
              label='Search User'
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value)
              }}
              variant='outlined'
              size='small'
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <Search />
                  </InputAdornment>
                )
              }}
            />
          </Box>
        </Box>
      </Grid>




      <Grid item xs={12}>
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer >
            <Table stickyHeader aria-label='sticky table'>
              <TableHead>
                <TableRow>
                  {columns.map(column => (
                    <TableCell key={column.id} align={column.align} sx={{ minWidth: column.minWidth }}>
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {users.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={columns.length} align="center">
                      <Typography variant="h6">No Users found</Typography>
                    </TableCell>
                  </TableRow>
                )}

                {users.map((row: Users) =>
                (
                  <TableRow hover role='checkbox' tabIndex={-1} key={row.id}>
                    {columns.map((column) => {
                      const value = row[column.id as keyof Users]
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.id === 'action' ? (
                            <IconButton color='primary' onClick={() => handleDeleteUser(row.id)}>
                              <Delete />
                            </IconButton>
                          ) : column.id === 'first_name' ? (
                            `${row.first_name} ${row.last_name}`
                          ) : column.id === 'role' &&
                            value !== null &&
                            typeof value !== 'string' &&
                            typeof value !== 'number' ? (
                            <span
                              style={{
                                color:
                                  typeof value.role === 'string' && value.role.toLowerCase() === 'admin'
                                    ? 'green'
                                    : typeof value.role === 'string' && value.role.toLowerCase() === 'user'
                                      ? 'orange'
                                      : 'text.primary'
                              }}
                            >
                              {typeof value.role === 'string' &&
                                value.role.charAt(0).toUpperCase() + value.role.slice(1).toLowerCase()}
                            </span>
                          ) : column.id === 'status' && value !== null ? (
                            <span
                              style={{
                                color:
                                  typeof value === 'string' && value.toLowerCase() === 'active'
                                    ? 'green'
                                    : typeof value === 'string' && value.toLowerCase() === 'inactive'
                                      ? 'orange'
                                      : 'text.primary'
                              }}
                            >
                              {typeof value === 'string' &&
                                value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()}
                            </span>
                          ) : column.format && typeof value === 'number' ? (
                            column.format(value)
                          ) : (
                            value
                          )}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component='div'
            count={totalCountUsers}
            rowsPerPage={limit}
            page={currentPageUsers - 1}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Grid>
    </Grid>
  )
}

export default withAuth(UserList)
