import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  IconButton,
  Stack
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { ref, onValue, remove } from 'firebase/database';
import { db } from '../firebase';

const AnswerList = ({ questionId, currentUser }) => {
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const answersRef = ref(db, `questions/${questionId}/answers`);

    const unsubscribe = onValue(
      answersRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const answersArray = Object.entries(data).map(([id, answer]) => ({
            id,
            ...answer
          }));
          setAnswers(answersArray.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        } else {
          setAnswers([]);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error loading answers:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [questionId]);

  const handleDeleteAnswer = async (answerId) => {
    if (window.confirm('Delete this answer?')) {
      try {
        const answerRef = ref(db, `questions/${questionId}/answers/${answerId}`);
        await remove(answerRef);
      } catch (error) {
        console.error('Error deleting answer:', error);
        alert('Error deleting answer: ' + error.message);
      }
    }
  };

  if (loading) {
    return <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>Loading answers...</Typography>;
  }

  return (
    <Box sx={{ mt: 2, ml: 2, pl: 2, borderLeft: '3px solid #1976d2' }}>
      <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
        {answers.length} {answers.length === 1 ? 'Answer' : 'Answers'}
      </Typography>
      {answers.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No answers yet.
        </Typography>
      ) : (
        <Stack spacing={1}>
          {answers.map((answer) => (
            <Card key={answer.id} variant="outlined" sx={{ mb: 1 }}>
              <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      {answer.content}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {answer.author || 'Anonymous'} · {new Date(answer.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                  {currentUser && currentUser.uid === answer.authorId && (
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteAnswer(answer.id)}
                      sx={{ ml: 1 }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default AnswerList;
