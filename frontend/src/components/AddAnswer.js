import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { ref, push, set } from 'firebase/database';
import { db } from '../firebase';

const AddAnswer = ({ questionId, currentUser, onAnswerAdded }) => {
  const [open, setOpen] = useState(false);
  const [answerText, setAnswerText] = useState('');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setAnswerText('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!answerText.trim()) {
      alert('Please enter an answer');
      return;
    }

    try {
      const answersRef = ref(db, `questions/${questionId}/answers`);
      const newAnswerRef = push(answersRef);
      await set(newAnswerRef, {
        content: answerText.trim(),
        author: currentUser?.displayName || currentUser?.email || 'Anonymous',
        authorId: currentUser?.uid || null,
        createdAt: new Date().toISOString()
      });
      handleClose();
      if (onAnswerAdded) onAnswerAdded();
    } catch (error) {
      console.error('Error adding answer:', error);
      alert('Error adding answer: ' + error.message);
    }
  };

  return (
    <>
      <Button
        size="small"
        variant="contained"
        onClick={handleClickOpen}
        sx={{ mt: 1 }}
      >
        Add Answer
      </Button>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Answer Question</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              autoFocus
              fullWidth
              multiline
              rows={4}
              label="Your Answer"
              variant="outlined"
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!answerText.trim()}
          >
            Submit Answer
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddAnswer;
