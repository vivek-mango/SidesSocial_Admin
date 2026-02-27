import React, { useState } from 'react'
import { FormControl, InputLabel, Select, MenuItem, TextField, Grid, FormHelperText } from '@mui/material'

const Dropdown = () => {
  const [selectedDropdownValue, setSelectedDropdownValue] = useState("checkbox")
  const [minRank, setMinRank] = useState('')
  const [maxRank, setMaxRank] = useState('')
  const [options, setOptions] = useState('')

  const handleDropdownChange = (event: { target: { value: React.SetStateAction<string> } }) => {
    setSelectedDropdownValue(event.target.value)
    if (event.target.value !== 'option4') {
      setMinRank('')
      setMaxRank('')
    }
  }

  return (
    <>
      <FormControl fullWidth margin='dense'>
        <InputLabel id='dropdown-label'>Dropdown Label</InputLabel>
        <Select
          labelId='dropdown-label'
          label={'Dropdown Label'}
          value={selectedDropdownValue}
          onChange={handleDropdownChange}
        >
          <MenuItem value='checkbox'>CheckBox</MenuItem>
          <MenuItem value='radiobutton'>RadioButton</MenuItem>
          <MenuItem value='text'>Text</MenuItem>
          <MenuItem value='radio_with_rank'>Radio with Rank</MenuItem>
        </Select>
      </FormControl>

      {selectedDropdownValue === 'radio_with_rank' && (
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField label='Min Rank' value={minRank} onChange={e => setMinRank(e.target.value)} fullWidth />
          </Grid>
          <Grid item xs={6}>
            <TextField label='Max Rank' value={maxRank} onChange={e => setMaxRank(e.target.value)} fullWidth />
          </Grid>
        </Grid>
      )}

      <TextField
        sx={{ mt: 2 }}
        fullWidth
        value={options}
        onChange={e => setOptions(e.target.value)}
        label={'Options'}
        helperText={
          <FormHelperText
            sx={{
              color: selectedDropdownValue === 'radio_with_rank' ? 'green' : 'orange', // Customize color here
              fontSize: '14px', // Customize font size here
            }}
          >Hint:Enter options separated by commas (e.g., Option 1, Option 2, Option 3)
          </FormHelperText>
        }
      />
    </>
  )
}
export default Dropdown
