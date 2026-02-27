import React, { useState } from 'react'
import styles from '../../../../styles/Survey.module.css'
import { Delete, Pencil } from 'mdi-material-ui'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material'
import QuestionInput from '../question-input'

interface QuestionListProps {
  questions: any[]
  onDeleteQuestion: (index: number) => void
  onUpdateQuestion: (updatedQuestion: any, index: number) => void
  setQuestions: (questions: any[]) => void
  isOptionA?: boolean
}

const QuestionList: React.FC<QuestionListProps> = ({ questions, onDeleteQuestion, onUpdateQuestion }) => {


  const [editQuestionData, setEditQuestionData] = useState<any>(null)
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [editQuestionIndex, setEditQuestionIndex] = useState<number | null>(null)

  const handleEditQuestion = (question: any, index: number) => {
    setEditQuestionData(question)
    setOpenEditDialog(true)
    setEditQuestionIndex(index)
  }

  const handleCloseEditDialog = () => {
    setEditQuestionData(null)
    setOpenEditDialog(false)
    setEditQuestionIndex(null)
  }

  const handleSaveEditedQuestion = () => {
    if (editQuestionIndex !== null) {
      onUpdateQuestion(editQuestionData, editQuestionIndex)
    }
    handleCloseEditDialog()
  }



  const handleDeleteClick = (questionId: number) => {
    onDeleteQuestion(questionId)
  }

  return (
    <div>
      <ul className={styles.questionList}>
        {questions.map((question: any, index: number) => (
          <li key={index}>
            <span>{question.question}</span>
            <div>
              <IconButton aria-label='edit' color='primary' onClick={() => handleEditQuestion(question, index)}>
                <Pencil />
              </IconButton>
              <IconButton color='primary' onClick={() => handleDeleteClick(question.id)}>
                <Delete />
              </IconButton>
            </div>
          </li>
        ))}
      </ul>

      <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
        <DialogTitle>Edit Question</DialogTitle>
        <DialogContent>
          {editQuestionData && <QuestionInput questionData={editQuestionData} setQuestionData={setEditQuestionData} isOptionA={null} />}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancel</Button>
          <Button onClick={handleSaveEditedQuestion}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default QuestionList
