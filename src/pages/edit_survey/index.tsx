import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Tab,
  TextField,
  Typography
} from '@mui/material'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import apolloClient from 'src/lib/auth/apollo'
import {
  ADD_SURVEY_QUESTIONS,
  DELETE_SURVEY_QUESTIONS,
  GET_SURVEY_DETAILS_BY_ID,
  UPDATE_SURVEY_DATA,
  UPDATE_SURVEY_QUESTIONS
} from 'src/lib/auth/graphql'
import styles from '../../../styles/Survey.module.css'
import ImageUpload from 'src/@core/components/image-upload'
import VideoUpload from 'src/@core/components/video-upload'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import QuestionInput from 'src/@core/components/question-input'
import QuestionList from 'src/@core/components/questions-list'
import { withAuth } from 'src/lib/auth/withAuth'
import { ArrowLeft, Plus } from 'mdi-material-ui'


interface SurveyData {
  name: string
  status: string
  image_url: null | string
  video_url: null | string
  created_by: number
  created_at: string
  survey_questions: SurveyQuestion[]
}

interface SurveyQuestion {
  id: number
  survey_id: number
  question: string
  options: string | null
  option_type: string | null
  option_range: { min: number | null; max: number | null }
  is_primary: boolean
  is_primary_a: boolean
  is_primary_b: boolean
  created_by: number
  created_at: string
}
const EditSurvey = () => {
  const router = useRouter()
  const { id } = router.query
  const idNumber = typeof id === 'string' ? parseInt(id) : undefined
  const [surveyData, setSurveyData] = useState<SurveyData>({
    name: '',
    status: '',
    image_url: "",
    video_url: "",
    created_by: 0,
    created_at: '',
    survey_questions: []
  })
  const [value, setValue] = useState('1')
  const [open, setOpen] = useState(false)
  const [dialog, setDialog] = useState(false)
  const [questions, setQuestions] = useState<any[]>([])
  const [newQuestionData, setNewQuestionData] = useState({
    question: '',
    option_type: 'checkbox',
    options: '',
    option_range: { min: null, max: null }
  })
  const [imageFile, setImageFile] = useState<any>(null)
  const [imagePreview, setImagePreview] = useState<any>(null)
  const [videoFile, setVideoFile] = useState<any>(null)
  const [videoPreview, setVideoPreview] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false);


  const handleAddQuestion = async () => {
    const newQuestion = {
      survey_id: idNumber,
      question: newQuestionData.question,
      options: newQuestionData.options,
      option_type: newQuestionData.option_type,
      option_range: {
        min: newQuestionData.option_range.min !== null ? parseInt(newQuestionData.option_range.min) : null,
        max: newQuestionData.option_range.max !== null ? parseInt(newQuestionData.option_range.max) : null
      },
      is_primary: false,
      is_primary_a: false,
      is_primary_b: false,
      created_by: 1
    }

    try {
      const { data } = await apolloClient.mutate({
        mutation: ADD_SURVEY_QUESTIONS,
        variables: {
          addSurveyQuestionsData: newQuestion
        }
      })

      const addedQuestion = data.addSurveyQuestions

      setSurveyData({
        ...surveyData,
        survey_questions: [...surveyData.survey_questions, addedQuestion]
      })

      setNewQuestionData({
        question: '',
        option_type: 'checkbox',
        options: '',
        option_range: { min: null, max: null }
      })
      toast.success('Question added successfully')

      setDialog(false)
    } catch (error) {
      toast.error('Failed to add question')
    }
  }

  const handleAddTabQuestion = async (isOptionA: boolean | null) => {
    const newQuestion = {
      survey_id: idNumber,
      question: newQuestionData.question,
      options: newQuestionData.options,
      option_type: newQuestionData.option_type,
      option_range: {
        min: newQuestionData.option_range.min !== null ? parseInt(newQuestionData.option_range.min) : null,
        max: newQuestionData.option_range.max !== null ? parseInt(newQuestionData.option_range.max) : null
      },
      is_primary: false,
      is_primary_a: isOptionA === true ? true : false,
      is_primary_b: isOptionA === true ? false : true,
      created_by: 1
    }
    try {
      const { data } = await apolloClient.mutate({
        mutation: ADD_SURVEY_QUESTIONS,
        variables: {
          addSurveyQuestionsData: newQuestion
        }
      })
      const addedQuestion = data.addSurveyQuestions
      setSurveyData({
        ...surveyData,
        survey_questions: [...surveyData.survey_questions, addedQuestion]
      })
      setNewQuestionData({
        question: '',
        option_type: 'checkbox',
        options: '',
        option_range: { min: null, max: null }
      })
      toast.success('Question added successfully')
      setOpen(false)
    } catch (error) {
      toast.error('Failed to add question')
    }
  }

  const handleClickOpen = (isOptionA: boolean | null) => {
    setOpen(true)
  }

  const handleClickOpenDialog = () => {
    setDialog(true)
  }
  const handleClose = () => {
    setOpen(false)
  }

  const handleCloseDialog = () => {
    setDialog(false)
  }

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSurveyData({ ...surveyData, [e.target.name]: e.target.value })
  }

  const handleBack = () => {
    router.push('/survey')
  }

  useEffect(() => {
    if (idNumber) {
      fetchSurveyDetailsById(idNumber)
    }
  }, [idNumber])

  const handleImageUpload = (imageFile: any) => {
    if (imageFile) {
      const blobUrl = URL.createObjectURL(imageFile)
      setImagePreview(blobUrl)
    }
    return imageFile;
  }

  const handleVideoUpload = (videoFile: any) => {
    if (videoFile) {
      const blobUrl = URL.createObjectURL(videoFile)
      setVideoPreview(blobUrl)
    }
    return videoFile;
  }


  const handleSubmit = async () => {
    const primaryQuestion = surveyData.survey_questions.find(q => q.is_primary)
    const options = primaryQuestion ? JSON.parse(primaryQuestion.options || '{}') : []
    const primaryQuestionInput = {
      id: primaryQuestion?.id,
      question: primaryQuestion?.question,
      options: options ? JSON.stringify(options) : '',
      option_type: primaryQuestion?.option_type,
      option_range: primaryQuestion?.option_range
    }

    let imageUrlToUpdate: string | null = surveyData.image_url

    if (imageUrlToUpdate) {
      imageUrlToUpdate = null
    }

    if (imageFile) {
      const uploadedImageUrl = await handleImageUpload(imageFile)
      imageUrlToUpdate = uploadedImageUrl as string
    }

    let videoUrlToUpdate: string | null = surveyData.video_url

    if (videoUrlToUpdate) {
      videoUrlToUpdate = null
    }

    if (videoFile) {
      const uploadedVideoUrl = await handleVideoUpload(videoFile)
      const isValidSize = uploadedVideoUrl.size <= 200 * 1024 * 1024;
      if (!isValidSize) {
        toast.error('Video file size exceeds 200 MB')
        return
      }
      videoUrlToUpdate = uploadedVideoUrl as string
    }
    try {
      setIsLoading(true);

      const { data } = await apolloClient.mutate({
        mutation: UPDATE_SURVEY_DATA,
        variables: {
          id: idNumber,
          name: surveyData.name,
          status: surveyData.status,
          image_url: imageUrlToUpdate,
          video_url: videoUrlToUpdate,
          primary_question: primaryQuestionInput,
          created_by: 1
        }
      })
      if (data && data.updateSurvey) {
        toast.success('Survey Update Successfully')
        setTimeout(() => {
          window.location.replace('/survey')
        }, 300)
      }
    } catch (error: any) {
      toast.error(error.message)
    }
    finally {
      setIsLoading(false); // Set loading state to false after the mutation is completed
    }
  }

  const handleDeleteQuestion = async (questionId: number) => {
    try {
      const { data } = await apolloClient.query({
        query: DELETE_SURVEY_QUESTIONS,
        variables: {
          ids: questionId
        }
      })
      const updatedSurveyQuestions = surveyData.survey_questions.filter(q => q.id !== questionId)
      setSurveyData({ ...surveyData, survey_questions: updatedSurveyQuestions })
      toast.success('Question deleted successfully')
    } catch (error) {
      toast.error('Failed to delete question')
    }
  }

  const handleUpdateQuestion = async (updatedQuestion: any, index: number) => {
    const { created_at, ...questionData } = updatedQuestion;

    try {
      const { data } = await apolloClient.mutate({
        mutation: UPDATE_SURVEY_QUESTIONS,
        variables: {
          updateSurveyQuestionsData: {
            ...questionData,
            option_range: {
              min: parseFloat(updatedQuestion.option_range.min),
              max: parseFloat(updatedQuestion.option_range.max)
            }
          }
        }
      })
      if (data && data.updateSurveyQuestions) {
        const updatedSurveyQuestions = surveyData.survey_questions.map((question) =>
          question.id === updatedQuestion.id ? updatedQuestion : question
        );
        setSurveyData({ ...surveyData, survey_questions: updatedSurveyQuestions });
        toast.success('Question updated successfully');
      } else {
        toast.error('Failed to update question');
      }

    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const fetchSurveyDetailsById = async (idNumber: number) => {

    try {

      const { data } = await apolloClient.query({
        query: GET_SURVEY_DETAILS_BY_ID,
        variables: {
          getSurveyDetailsById: idNumber
        }
      })
      const parsedData = JSON.parse(data.getSurveyDetailsById)
      setSurveyData(parsedData)
    } catch (error: any) {
      toast.error(error.message)
    }
  }



  const handlePrimaryQuestionChange = (index: number, newQuestion: string) => {
    const updatedSurveyQuestions = [...surveyData.survey_questions]
    const primaryQuestion = updatedSurveyQuestions.find(q => q.is_primary)
    if (primaryQuestion) {
      primaryQuestion.question = newQuestion
      setSurveyData({ ...surveyData, survey_questions: updatedSurveyQuestions })
    }
  }

  return (
    <Grid container spacing={6} alignItems='center' sx={{ background: 'white', borderRadius: '20px' }}>
      <Grid item xs={12} className={styles.gridcss}>
        <Typography variant='h5' sx={{ color: 'primary.main' }}>
          EDIT SURVEY
        </Typography>

        <Button variant='contained' sx={{ background: 'primary.main' }} onClick={handleBack} startIcon={<ArrowLeft />}>
          Back
        </Button>
      </Grid>
      <Grid item xs={12}>
        <form>
          <Grid container spacing={5}>
            <Grid item xs={8}>
              <Grid container spacing={3} direction='column'>
                <Grid item xs={12}>
                  <TextField
                    name='name'
                    value={surveyData.name}
                    fullWidth
                    label='Survey Name'
                    placeholder='Survey Name'
                    onChange={handleInputChange}
                  />
                </Grid>

                <Grid item xs={9}>
                  <ImageUpload
                    imageFile={imageFile}
                    setImageFile={setImageFile}
                    imagePreview={imagePreview}
                    setImagePreview={setImagePreview}
                    imageUrl={surveyData.image_url}
                  />
                </Grid>

                <Grid item xs={12}>
                  <VideoUpload
                    videoFile={videoFile}
                    setVideoFile={setVideoFile}
                    videoPreview={videoPreview}
                    setVideoPreview={setVideoPreview}
                    videoUrl={surveyData.video_url}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant='h6' sx={{ mb: 2 }}>
                    Primary Question
                  </Typography>
                  {surveyData.survey_questions.map(
                    question =>
                      question.is_primary && (
                        <TextField
                          key={question.id}
                          label='Primary Question'
                          value={question.question}
                          fullWidth
                          onChange={e => handlePrimaryQuestionChange(question.id, e.target.value)}
                          sx={{ mt: 1 }}
                        />
                      )
                  )}

                  <Grid container spacing={4} sx={{ mt: 1 }}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label='Answer of Option A'
                        value={
                          surveyData.survey_questions.find(q => q.is_primary)
                            ? JSON.parse(surveyData.survey_questions.find(q => q.is_primary)?.options || '{}')
                              .option_a || ''
                            : ''
                        }
                        fullWidth
                        onChange={e => {
                          const primaryQuestion = surveyData.survey_questions.find(q => q.is_primary)
                          if (primaryQuestion && primaryQuestion.options) {
                            const updatedOptions = JSON.parse(primaryQuestion.options)
                            updatedOptions.option_a = e.target.value
                            const updatedSurveyQuestions = [...surveyData.survey_questions]
                            const updatedPrimaryQuestion = {
                              ...primaryQuestion,
                              options: JSON.stringify(updatedOptions)
                            }
                            updatedSurveyQuestions[updatedSurveyQuestions.indexOf(primaryQuestion)] =
                              updatedPrimaryQuestion
                            setSurveyData({ ...surveyData, survey_questions: updatedSurveyQuestions })
                          }
                        }}
                        sx={{ mt: 1 }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label='Answer of Option B'
                        value={
                          surveyData.survey_questions.find(q => q.is_primary)
                            ? JSON.parse(surveyData.survey_questions.find(q => q.is_primary)?.options || '{}')
                              .option_b || ''
                            : ''
                        }
                        fullWidth
                        onChange={e => {
                          const primaryQuestion = surveyData.survey_questions.find(q => q.is_primary)
                          if (primaryQuestion && primaryQuestion.options) {
                            const updatedOptions = JSON.parse(primaryQuestion.options)
                            updatedOptions.option_b = e.target.value
                            const updatedSurveyQuestions = [...surveyData.survey_questions]
                            const updatedPrimaryQuestion = {
                              ...primaryQuestion,
                              options: JSON.stringify(updatedOptions)
                            }
                            updatedSurveyQuestions[updatedSurveyQuestions.indexOf(primaryQuestion)] =
                              updatedPrimaryQuestion
                            setSurveyData({ ...surveyData, survey_questions: updatedSurveyQuestions })
                          }
                        }}
                        sx={{ mt: 1 }}
                      />
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ width: '100%', typography: 'body1' }}>
                    <TabContext value={value}>
                      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <TabList onChange={handleChange} aria-label='lab API tabs example'>
                          <Tab label='A' value='1' />
                          <Tab label='B' value='2' />
                        </TabList>
                      </Box>

                      <TabPanel value='1'>
                        <Grid container spacing={2} alignItems='center' className={styles.questionCSS}>
                          <Grid item>
                            <Typography variant='h6'>Questions For Option A</Typography>
                          </Grid>
                          <Grid item>
                            <Button variant='contained' onClick={() => handleClickOpen(true)} startIcon={<Plus />}>
                              Add
                            </Button>
                          </Grid>
                        </Grid>

                        <Box mt={2}>
                          <QuestionList
                            questions={surveyData.survey_questions.filter(
                              question =>
                                !question.is_primary && question.is_primary_a === true && !question.is_primary_b
                            )}
                            onDeleteQuestion={handleDeleteQuestion}
                            onUpdateQuestion={handleUpdateQuestion}
                            setQuestions={setQuestions}
                            isOptionA={true}
                          />
                        </Box>
                      </TabPanel>
                      <TabPanel value='2'>
                        <Grid container spacing={2} alignItems='center' className={styles.questionCSS}>
                          <Grid item>
                            <Typography variant='h6'>Questions For Option B</Typography>
                          </Grid>
                          <Grid item>
                            <Button variant='contained' onClick={() => handleClickOpen(false)} startIcon={<Plus />}>
                              Add
                            </Button>
                          </Grid>
                        </Grid>
                        <Box mt={2}>
                          <QuestionList
                            questions={surveyData.survey_questions.filter(
                              question =>
                                !question.is_primary && !question.is_primary_a && question.is_primary_b === true
                            )}
                            onDeleteQuestion={handleDeleteQuestion}
                            onUpdateQuestion={handleUpdateQuestion}
                            setQuestions={setQuestions}
                            isOptionA={false}
                          />
                        </Box>
                      </TabPanel>
                    </TabContext>
                  </Box>
                </Grid>

                <Divider />

                <Grid item xs={12}>
                  <Grid container spacing={2} alignItems='center' className={styles.questionCSS}>
                    <Grid item>
                      <Typography variant='h5'>Survey Questions</Typography>
                    </Grid>
                    <Grid item>
                      <Button variant='contained' onClick={handleClickOpenDialog} startIcon={<Plus />}>
                        Add
                      </Button>
                    </Grid>
                  </Grid>
                  <Box mt={2}>
                    <QuestionList
                      questions={surveyData.survey_questions.filter(
                        question => !question.is_primary && !question.is_primary_a && !question.is_primary_b
                      )}
                      onDeleteQuestion={handleDeleteQuestion}
                      onUpdateQuestion={handleUpdateQuestion}
                      setQuestions={setQuestions}
                    />

                  </Box>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={3.8}>
              <div className={styles.stickycss}>
                <Grid container spacing={2} direction='column' alignItems='center'>
                  <FormControl fullWidth margin='dense'>
                    <InputLabel id='dropdown-label'>Status</InputLabel>
                    <Select
                      name='status'
                      labelId='dropdown-label'
                      label="Status"
                      value={surveyData.status}
                      onChange={e => setSurveyData({ ...surveyData, status: e.target.value })}
                    >
                      <MenuItem value='active'>Active</MenuItem>
                      <MenuItem value='inactive'>Inactive</MenuItem>
                      <MenuItem value='trash'>Trash</MenuItem>
                    </Select>
                  </FormControl>
                  <Grid item>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSubmit}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Updating...' : 'Update'}
                    </Button>
                    {isLoading && <CircularProgress size={24} sx={{ ml: 2 }} />}
                  </Grid>
                </Grid>
              </div>
            </Grid>
          </Grid>
        </form>
      </Grid>

      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>Add a New Question</DialogTitle>
        <DialogContent>
          <QuestionInput
            questionData={newQuestionData}
            setQuestionData={setNewQuestionData}
            isOptionA={value === '1' ? true : value === '2' ? false : null}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={() => handleAddTabQuestion(value === '1')}>Add</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={dialog} onClose={handleCloseDialog} fullWidth>
        <DialogTitle>Add a New Question</DialogTitle>
        <DialogContent>
          <QuestionInput questionData={newQuestionData} setQuestionData={setNewQuestionData} isOptionA={null} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleAddQuestion}>Add</Button>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}
export default withAuth(EditSurvey)
