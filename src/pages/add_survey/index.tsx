import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
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
  InputLabel,
  MenuItem,
  Select,
  Tab,
  TextField
} from '@mui/material'
import styles from '../../../styles/Survey.module.css'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { withAuth } from 'src/lib/auth/withAuth'
import QuestionList from 'src/@core/components/questions-list'
import apolloClient from 'src/lib/auth/apollo'
import { CREATE_SURVEY } from 'src/lib/auth/graphql'
import ImageUpload from 'src/@core/components/image-upload'
import VideoUpload from 'src/@core/components/video-upload'
import QuestionInput from 'src/@core/components/question-input'
import toast from 'react-hot-toast'
import { ArrowLeft, Plus } from 'mdi-material-ui'


const AddSurvey = () => {
  const [value, setValue] = React.useState('1')
  const [open, setOpen] = useState(false)
  const [dialog, setDialog] = useState(false)
  const [questions, setQuestions] = useState<any[]>([])
  const [imageFile, setImageFile] = useState<any>(null)
  const [imagePreview, setImagePreview] = useState<any>()
  const [videoFile, setVideoFile] = useState<any>(null)
  const [videoPreview, setVideoPreview] = useState<any>()
  const [newQuestionData, setNewQuestionData] = useState({
    question: '',
    options: '',
    option_type: '',
    option_range: { min: '', max: '' }
  })
  const [isLoading, setIsLoading] = useState(false);


  const handleAddTabQuestion = (isOptionA: boolean | null) => {
    const newQuestion = { ...newQuestionData };
    if (isOptionA === true) {
      setSurveyData({
        ...surveyData,
        option_a_question: [...surveyData.option_a_question, newQuestion],
      });
    } else if (isOptionA === false) {
      setSurveyData({
        ...surveyData,
        option_b_question: [...surveyData.option_b_question, newQuestion],
      });
    }
    setNewQuestionData({
      question: '',
      options: '',
      option_type: '',
      option_range: { min: '', max: '' },
    });
    handleClose();
  };


  const handleAddQuestion = () => {
    const newQuestion = { ...newQuestionData }
    setQuestions([...questions, newQuestion])
    setSurveyData({
      ...surveyData,
      survey_questions: [...surveyData.survey_questions, newQuestion]
    })
    setNewQuestionData({
      question: '',
      options: '',
      option_type: '',
      option_range: { min: '', max: '' }
    })
    handleCloseDialog()
  }

  const handleUpdateQuestion = (updatedQuestion: any, index: number) => {
    const updatedQuestions = [...questions]
    updatedQuestions[index] = updatedQuestion
    setQuestions(updatedQuestions)
    setSurveyData({
      ...surveyData,
      survey_questions: updatedQuestions
    })
  }


  const handleDeleteQuestion = (index: number) => {
    const updatedQuestions = [...questions]
    updatedQuestions.splice(index, 1)
    setQuestions(updatedQuestions)
  }

  const [surveyData, setSurveyData] = useState({
    name: '',
    status: '',
    primary_question: {
      question: '',
      options: {
        option_a: '',
        option_b: ''
      }
    },
    option_a_question: [] as {
      question: string
      options: string
      option_type: string
      option_range: { min: string; max: string }
    }[],
    option_b_question: [] as {
      question: string
      options: string
      option_type: string
      option_range: { min: string; max: string }
    }[],
    survey_questions: [] as {
      question: string
      options: string
      option_type: string
      option_range: { min: string; max: string }
    }[]
  })



  const router = useRouter()
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  const handleBack = () => {
    router.push('/survey')
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

  const handleUpdateDialogQuestion = (updatedQuestion: any, index: number, isOptionA: boolean | null) => {
    if (isOptionA === true) {
      const updatedQuestions = [...surveyData.option_a_question]
      updatedQuestions[index] = updatedQuestion
      setSurveyData({
        ...surveyData,
        option_a_question: updatedQuestions
      })
    } else if (isOptionA === false) {
      const updatedQuestions = [...surveyData.option_b_question]
      updatedQuestions[index] = updatedQuestion
      setSurveyData({
        ...surveyData,
        option_b_question: updatedQuestions
      })
    } else {
      const updatedQuestions = [...surveyData.survey_questions]
      updatedQuestions[index] = updatedQuestion
      setSurveyData({
        ...surveyData,
        survey_questions: updatedQuestions
      })
    }
  }

  const handleDeleteDialogQuestion = (index: number, isOptionA: boolean | null) => {
    if (isOptionA === true) {
      const updatedQuestions = [...surveyData.option_a_question]
      updatedQuestions.splice(index, 1)
      setSurveyData({
        ...surveyData,
        option_a_question: updatedQuestions
      })
    } else if (isOptionA === false) {
      const updatedQuestions = [...surveyData.option_b_question]
      updatedQuestions.splice(index, 1)
      setSurveyData({
        ...surveyData,
        option_b_question: updatedQuestions
      })
    } else {
      const updatedQuestions = [...surveyData.survey_questions]
      updatedQuestions.splice(index, 1)
      setSurveyData({
        ...surveyData,
        survey_questions: updatedQuestions
      })
    }
  }
  const handleSubmit = async () => {
    if (!surveyData.name) {
      toast.error('Please enter survey name')
      return
    }

    if (!surveyData.status) {
      toast.error('please  select status')
      return
    }

    console.log("videoFile", videoFile.size)
    const isValidSize = videoFile.size <= 200 * 1024 * 1024; // 200 MB in bytes

    if (!isValidSize) {
      toast.error('Video file size exceeds 200 MB')
      return
    }

    try {
      setIsLoading(true);

      const { data } = await apolloClient.mutate({
        mutation: CREATE_SURVEY,
        variables: {
          name: surveyData.name,
          status: surveyData.status,
          created_by: 1,
          image_url: imageFile || null,
          video_url: videoFile || null,
          primary_question: {
            question: surveyData.primary_question.question,
            options: JSON.stringify(surveyData.primary_question.options)
          },
          option_a_question: surveyData.option_a_question.map(question => ({
            ...question,
            option_range: {
              min: parseFloat(question.option_range.min),
              max: parseFloat(question.option_range.max)
            }
          })),
          option_b_question: surveyData.option_b_question.map(question => ({
            ...question,
            option_range: {
              min: parseFloat(question.option_range.min),
              max: parseFloat(question.option_range.max)
            }
          })),
          survey_questions: surveyData.survey_questions.map(question => ({
            ...question,
            option_range: {
              min: parseFloat(question.option_range.min),
              max: parseFloat(question.option_range.max)
            }
          }))
        },
        context: {
          useMultipart: true
        }
      })
      if (data?.createSurvey) {
        toast.success('Survey Created successfully')
        setTimeout(() => {
          window.location.replace('/survey')
        }, 100)
      }
    } catch (error: any) {
      toast.error(error.message)
    }
    finally {
      setIsLoading(false); // Set loading state to false after the mutation is completed
    }
  }

  return (
    <Grid container spacing={6} alignItems='center' sx={{ background: 'white', borderRadius: '20px' }}>

      <Grid item xs={12} className={styles.gridcss}>
        <Typography variant='h5' sx={{ color: 'primary.main' }}>
          ADD SURVEY
        </Typography>

        <Button variant='contained' sx={{ background: 'primary.main' }} onClick={handleBack} startIcon={<ArrowLeft />}>
          Back
        </Button>
      </Grid>
      <Grid item xs={12}>
        <form>
          <Grid container spacing={5} className={styles.gridDiv}>
            <Grid item xs={8}>
              <Grid container spacing={3} direction='column'>
                <Grid item xs={12}>
                  <TextField
                    value={surveyData.name}
                    fullWidth
                    label='Survey Name'
                    placeholder='Survey Name'
                    onChange={e => setSurveyData({ ...surveyData, name: e.target.value })}
                  />
                </Grid>
                <Grid item xs={9}>
                  <ImageUpload
                    imageFile={imageFile}
                    setImageFile={setImageFile}
                    imagePreview={imagePreview}
                    setImagePreview={setImagePreview}
                  />
                </Grid>
                <Grid item xs={12}>
                  <VideoUpload
                    videoFile={videoFile}
                    setVideoFile={setVideoFile}
                    videoPreview={videoPreview}
                    setVideoPreview={setVideoPreview}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant='h6' sx={{ mb: 2 }}>
                    Primary Question
                  </Typography>
                  <TextField
                    label='Primary Question'
                    value={surveyData.primary_question.question}
                    fullWidth
                    onChange={e =>
                      setSurveyData({
                        ...surveyData,
                        primary_question: {
                          ...surveyData.primary_question,
                          question: e.target.value
                        }
                      })
                    }
                    sx={{ mt: 1 }}
                  />
                  <Grid container spacing={4} sx={{ mt: 1 }}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label='Answer of Option A'
                        value={surveyData.primary_question.options.option_a}
                        fullWidth
                        onChange={e =>
                          setSurveyData({
                            ...surveyData,
                            primary_question: {
                              ...surveyData.primary_question,
                              options: {
                                ...surveyData.primary_question.options,
                                option_a: e.target.value
                              }
                            }
                          })
                        }
                        sx={{ mt: 1 }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label='Answer of Option B'
                        value={surveyData.primary_question.options.option_b}
                        fullWidth
                        onChange={e =>
                          setSurveyData({
                            ...surveyData,
                            primary_question: {
                              ...surveyData.primary_question,
                              options: {
                                ...surveyData.primary_question.options,
                                option_b: e.target.value
                              }
                            }
                          })
                        }
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
                            questions={surveyData.option_a_question}
                            onDeleteQuestion={index => handleDeleteDialogQuestion(index, true)}
                            onUpdateQuestion={(updatedQuestion, index) =>
                              handleUpdateDialogQuestion(updatedQuestion, index, true)
                            }
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
                            questions={surveyData.option_b_question}
                            onDeleteQuestion={index => handleDeleteDialogQuestion(index, false)}
                            onUpdateQuestion={(updatedQuestion, index) =>
                              handleUpdateDialogQuestion(updatedQuestion, index, false)
                            }
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
                      <Typography variant='h6'>Survey Questions</Typography>
                    </Grid>
                    <Grid item>
                      <Button variant='contained' onClick={handleClickOpenDialog} startIcon={<Plus />} >
                        Add
                      </Button>
                    </Grid>
                  </Grid>
                  <Box mt={2}>
                    <QuestionList questions={questions} onDeleteQuestion={handleDeleteQuestion}
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
                      labelId='dropdown-label'
                      label={'Status'}
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
                      {isLoading ? 'Saving...' : 'Save'}
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

export default withAuth(AddSurvey)
