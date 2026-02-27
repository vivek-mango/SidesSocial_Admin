import React, { useState } from 'react'
import { FormControl, Grid, InputLabel, MenuItem, Select, TextField, FormHelperText } from '@mui/material'

interface QuestionInputProps {
  questionData: any;
  setQuestionData: (data: any) => void;
  isOptionA: boolean | null;
}

const QuestionInput: React.FC<QuestionInputProps> = ({ questionData, setQuestionData, isOptionA }: any) => {

  const [minRankError, setMinRankError] = useState('')
  const [maxRankError, setMaxRankError] = useState('')

  const handleMinRankChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (isNaN(Number(value)) || value.includes('.')) {
      setMinRankError('Please enter a valid number')
    } else {
      setMinRankError('')
      setQuestionData({
        ...questionData,
        option_range: {
          ...questionData.option_range,
          min: value
        }
      })
    }
  }

  const handleMaxRankChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (isNaN(Number(value)) || value.includes('.')) {
      setMaxRankError('Please enter a valid number')
    } else {
      setMaxRankError('')
      setQuestionData({
        ...questionData,
        option_range: {
          ...questionData.option_range,
          max: value
        }
      })
    }
  }

  return (
    <>
      <TextField
        margin='dense'
        fullWidth
        label='Question'
        value={questionData.question}
        onChange={e => setQuestionData({ ...questionData, question: e.target.value })}
      />
      <FormControl fullWidth margin='dense'>
        <InputLabel id='dropdown-label'>Option Type</InputLabel>
        <Select
          labelId='dropdown-label'
          label='Option Type'
          value={questionData.option_type}
          onChange={e => setQuestionData({ ...questionData, option_type: e.target.value })}
          defaultValue='checkbox'
        >
          <MenuItem value='checkbox'>CheckBox</MenuItem>
          <MenuItem value='radiobutton'>RadioButton</MenuItem>
          <MenuItem value='text'>Text</MenuItem>
          <MenuItem value='radio_with_rank'>Radio with Rank</MenuItem>
        </Select>
      </FormControl>

      {questionData.option_type === 'radio_with_rank' && (
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label='Min Rank'
              value={questionData.option_range.min}
              onChange={handleMinRankChange}
              type='number'
              error={!!minRankError}
              helperText={minRankError}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label='Max Rank'
              value={questionData.option_range.max}
              onChange={handleMaxRankChange}
              type='number'
              error={!!maxRankError}
              helperText={maxRankError}
              fullWidth
            />
          </Grid>
        </Grid>
      )}

      {questionData.option_type != 'text' && (
        <TextField
          sx={{ mt: 3 }}
          fullWidth
          value={questionData.options}
          onChange={e => setQuestionData({ ...questionData, options: e.target.value })}
          label={'Options'}
          helperText={
            <FormHelperText
              sx={{ color: questionData.option_type === 'radio_with_rank' ? 'green' : 'orange', fontSize: '14px' }}
            >
              Hint: Enter options separated by commas (e.g., Option 1; Option 2; Option 3)
            </FormHelperText>
          }
        />
      )}
    </>
  )
}

export default QuestionInput
