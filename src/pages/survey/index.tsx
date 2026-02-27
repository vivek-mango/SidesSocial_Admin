// ** MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import { Box, Button, IconButton, InputAdornment, Tab, TablePagination, Tabs, TextField, Tooltip } from '@mui/material'
import styles from '../../../styles/Survey.module.css'
import { SyntheticEvent, useEffect, useState } from 'react'
import { withAuth } from '../../lib/auth/withAuth'
import { DELETE_SURVEY, GET_SURVEYS, GET_SURVEYS_STATUS_COUNT } from 'src/lib/auth/graphql'
import toast from 'react-hot-toast'
import {
  Delete,
  ImageSearch,
  Pencil,
  Plus,
  Video
} from 'mdi-material-ui'
import { Search } from '@mui/icons-material'
import apolloClient from 'src/lib/auth/apollo'
import themeConfig from 'src/configs/themeConfig'
import { useRouter } from 'next/router'

interface Survey {
  id: number
  name: string
  status: string
  image_url: string | null
  video_url: string | null
  questionCount: number
  primary_question: string
  option_a_question: string
  option_b_question: string
  option: string | null
  type: string | null
  range: string | null
  created_by: number
  created_at: string
}
interface Column {
  id: 'id' | 'name' | 'image_url' | 'video_url' | 'status' | 'questionCount' | 'action'
  label: string
  minWidth?: number
  align?: 'right'
  format?: (value: number) => string
}

const columns: readonly Column[] = [
  { id: 'id', label: 'ID', minWidth: 100 },
  { id: 'name', label: 'Survey Name', minWidth: 200 },
  { id: 'image_url', label: 'Image', minWidth: 100 },
  { id: 'video_url', label: 'Video', minWidth: 100 },
  {
    id: 'status',
    label: 'Status',
    minWidth: 100
  },
  {
    id: 'questionCount',
    label: 'Question',
    minWidth: 100,
  },
  { id: 'action', label: 'Action', minWidth: 100 }
]

const SurveyList = () => {
  const router = useRouter()
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState(10)
  const [survey, setSurvey] = useState<Survey[]>([])
  const [totalCountSurvey, setTotalCountSurvey] = useState<number>(0)
  const [totalSurvey, setTotalSurvey] = useState<number>(0)
  const [currentPageSurvey, setCurrentPageSurvey] = useState<number>(0)
  const [selectedTab, setSelectedTab] = useState<string>('all')
  const [statusCounts, setStatusCounts] = useState<{ [key: string]: number }>({})
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    // fetchSurveyList()
    fetchSurveyList(page, limit, selectedTab, searchTerm)
    fetchStatusCount()

  }, [page, limit, selectedTab, searchTerm])


  const fetchStatusCount = async () => {
    try {
      const { data } = await apolloClient.query({
        query: GET_SURVEYS_STATUS_COUNT,
        variables: {
          search: searchTerm
        }
      })
      const parseData = JSON.parse(data.getSurveyStatusCount)
      setTotalSurvey(parseData.totalCount)
      const statuscounts = parseData.counts.reduce(
        (acc: { [key: string]: number }, curr: { survey_status: string; count: string }) => {
          acc[curr.survey_status] = parseInt(curr.count, 10)
          return acc
        },
        {}
      )
      setStatusCounts(statuscounts)
    } catch (error) { }
  }


  const fetchSurveyList = async (
    page: number,
    limit: number,
    selectedTab: string,
    searchTerm: string
  ) => {
    try {
      const { data } = await apolloClient.query({
        query: GET_SURVEYS,
        variables: {
          page: page,
          limit: limit,
          search: searchTerm,
          sortBy: "created_at",
          sortOrder: "DESC",
          filterBy:
            selectedTab === "active" ||
              selectedTab === "inactive" ||
              selectedTab === "trash"
              ? "status"
              : null,
          filterValue:
            selectedTab === "active"
              ? "active"
              : selectedTab === "inactive"
                ? "inactive"
                : selectedTab === "trash"
                  ? "trash"
                  : null,
        },
      });
      const { currentPage, totalCount, totalPages } = data.getSurveys;
      setSurvey(JSON.parse(data.getSurveys.data));
      setTotalCountSurvey(totalCount);
      setCurrentPageSurvey(currentPage);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleEditSurvey = (row: any) => {
    router.push(`/edit_survey?id=${row.id}`)

  }

  const handleDeleteSurvey = async (id: number) => {
    try {
      const { data } = await apolloClient.query({
        query: DELETE_SURVEY,
        variables: {
          deleteSurveyId: id
        }
      })
      setSurvey((prevSurvey) => prevSurvey.filter((s) => s.id !== id));
      setTotalCountSurvey((prevTotalCount) => prevTotalCount - 1)
      setTotalSurvey((prevTotalSurvey) => prevTotalSurvey - 1)
      setStatusCounts((prevStatusCounts) => {
        const newStatusCounts = { ...prevStatusCounts }
        newStatusCounts[data.deleteSurvey.status] = prevStatusCounts[data.deleteSurvey.status] - 1
        return newStatusCounts
      })
      setCurrentPageSurvey((prevCurrentPageSurvey) => prevCurrentPageSurvey - 1)

      toast.success('Survey deleted successfully')

    } catch (error: any) {
      toast.error(error.message)
    }
  }


  const handleTabChange = (event: SyntheticEvent, newValue: string) => {
    setSelectedTab(newValue)
    fetchSurveyList(page, limit, newValue, searchTerm)
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage + 1)
    fetchSurveyList(page, limit, selectedTab, searchTerm)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLimit(parseInt(event.target.value, 10))
    setPage(1)
    fetchSurveyList(1, parseInt(event.target.value, 10), selectedTab, searchTerm)
  }

  const handleMove = () => {
    router.push('/add_survey')
  }
  const renderStatus = (status: string) => {
    switch (status) {
      case 'active':
        return <span style={{ color: 'green' }}>Active</span>
      case 'inactive':
        return <span style={{ color: 'orange' }}>Inactive</span>
      case 'trash':
        return <span style={{ color: 'red' }}>Trash</span>
      default:
        return status
    }
  }

  return (
    <Grid container spacing={6} alignItems='center'>
      <Grid item xs={12} className={styles.gridcss}>
        <Typography variant='h5' sx={{ color: 'primary.main' }}>
          Surveys
        </Typography>

        <Button variant='contained' sx={{ background: 'primary.main' }} onClick={handleMove} startIcon={<Plus />}>
          Add Survey
        </Button>
      </Grid>

      <Grid item xs={12}>
        <Box display='flex' alignItems='center'>
          <Box flex={1}>
            <Tabs value={selectedTab} onChange={handleTabChange} aria-label='survey status tabs'>
              <Tab label={`All (${totalSurvey})`} value='all' />
              <Tab label={`Active (${statusCounts.active || 0})`} value='active' />
              <Tab label={`Inactive (${statusCounts.inactive || 0})`} value='inactive' />
              <Tab label={`Trash (${statusCounts.trash || 0})`} value='trash' />
            </Tabs>
          </Box>
          <Box>
            <TextField
              label='Search Survey'
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

      <Grid item xs={12} className='maingridcss'>
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer sx={{}}>
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
                {survey.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={columns.length} align="center">
                      <Typography variant="h6">No surveys found</Typography>
                    </TableCell>
                  </TableRow>
                )}
                {survey.map((row: Survey) => {
                  const { id, name, image_url, video_url, status, questionCount } = row
                  return (
                    <TableRow hover role='checkbox' tabIndex={-1} key={id}>
                      {columns.map((column, index) => {
                        const value =
                          column.id === 'id'
                            ? id
                            : column.id === 'name'
                              ? name
                              : column.id === 'image_url'
                                ? image_url
                                : column.id === 'video_url'
                                  ? video_url
                                  : column.id === 'status'
                                    ? renderStatus(status)
                                    : column.id === 'questionCount'
                                      ? questionCount
                                      : null

                        return (
                          <TableCell key={`${id}-${index}`} align={column.align}>
                            {column.id === 'image_url' && image_url && (
                              <IconButton>
                                <ImageSearch
                                  onClick={() => image_url && window.open(`${themeConfig.graphQLEndPoint + image_url}`)}
                                />
                              </IconButton>
                            )}
                            {column.id === 'video_url' && video_url && (
                              <IconButton >
                                <Video
                                  onClick={() => video_url && window.open(`${themeConfig.graphQLEndPoint + video_url}`)}
                                />
                              </IconButton>
                            )}
                            {column.id !== 'image_url' &&
                              column.id !== 'video_url' &&
                              column.id !== 'action' &&
                              (column.format && typeof value === 'number' ? column.format(value) : value)}
                            {column.id === 'action' && (
                              <Box display='flex' alignItems='center'>
                                <IconButton aria-label='edit' color='primary' onClick={() => handleEditSurvey(row)}>
                                  <Pencil />
                                </IconButton>
                                {status === 'trash' && (
                                  <IconButton aria-label='delete' color='error' onClick={() => handleDeleteSurvey(row.id)}>
                                    <Delete />
                                  </IconButton>
                                )}
                              </Box>
                            )}
                          </TableCell>
                        )
                      })}
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component='div'
            count={totalCountSurvey}
            rowsPerPage={limit}
            page={currentPageSurvey - 1}
            // page={currentPageSurvey}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Grid>
    </Grid >
  )
}

export default withAuth(SurveyList)
