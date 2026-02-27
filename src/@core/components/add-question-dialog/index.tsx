import React, { useState } from 'react'
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from '@mui/material'
import Dropdown from 'src/@core/components/dropdown'

interface AddQuestionDialogProps {
  open: boolean
  handleClose: () => void
  handleAddQuestion: (newQuestion: string) => void
}

const AddQuestionDialog: React.FC<AddQuestionDialogProps> = ({ open, handleClose, handleAddQuestion }) => {
  const [newQuestion, setNewQuestion] = useState('')

  const handleAdd = () => {
    handleAddQuestion(newQuestion)
    setNewQuestion('')
    handleClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>Add a New Question</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin='dense'
          label='Question'
          fullWidth
          variant='standard'
          value={newQuestion}
          onChange={e => setNewQuestion(e.target.value)}
        />
        <Dropdown />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleAdd}>Add</Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddQuestionDialog
