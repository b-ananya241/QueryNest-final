import React, { useState } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Card,
  CardContent,
  Chip,
  Box,
  IconButton,
  Button,
  Stack
} from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import { ref, set, remove, update } from 'firebase/database';
import { db } from '../firebase';
import AnswerList from './AnswerList';
import AddAnswer from './AddAnswer';

const QuestionList = ({ questions, currentUser }) => {
  const handleUpvote = async (questionId, upvotes) => {
    if (!currentUser) {
      alert('Please sign in to upvote');
      return;
    }

    try {
      const upvotesRef = ref(db, `questions/${questionId}/upvotes/${currentUser.uid}`);
      if (upvotes && upvotes[currentUser.uid]) {
        // Remove upvote
        await remove(upvotesRef);
      } else {
        // Add upvote
        await set(upvotesRef, true);
      }
    } catch (error) {
      console.error('Error updating upvote:', error);
      alert('Error updating upvote: ' + error.message);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (window.confirm('Delete this question? This cannot be undone.')) {
      try {
        const questionRef = ref(db, `questions/${questionId}`);
        await remove(questionRef);
      } catch (error) {
        console.error('Error deleting question:', error);
        alert('Error deleting question: ' + error.message);
      }
    }
  };
  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" component="h2" gutterBottom>
        Recent Questions
      </Typography>
      {questions.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          No questions yet. Be the first to ask!
        </Typography>
      ) : (
        <List sx={{ p: 0 }}>
          {questions.map((question) => {
            const upvoteCount = question.upvotes ? Object.keys(question.upvotes).length : 0;
            const userHasUpvoted = currentUser && question.upvotes && question.upvotes[currentUser.uid];
            const isAuthor = currentUser && currentUser.uid === question.authorId;

            return (
              <Card key={question.id} sx={{ mb: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" component="h3" sx={{ mb: 1 }}>
                        {question.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {question.description}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                        Asked by: {question.author || 'Anonymous'} · {new Date(question.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                    {isAuthor && (
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteQuestion(question.id)}
                        sx={{ ml: 1 }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Box>

                  <Stack direction="row" spacing={2} sx={{ mb: 2, alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleUpvote(question.id, question.upvotes)}
                        color={userHasUpvoted ? 'primary' : 'default'}
                      >
                        {userHasUpvoted ? <ThumbUpIcon fontSize="small" /> : <ThumbUpOutlinedIcon fontSize="small" />}
                      </IconButton>
                      <Typography variant="body2">{upvoteCount}</Typography>
                    </Box>
                    <Chip
                      label={`${question.answers ? Object.keys(question.answers).length : 0} Answers`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Stack>

                  {currentUser && <AddAnswer questionId={question.id} currentUser={currentUser} />}

                  <AnswerList questionId={question.id} currentUser={currentUser} />
                </CardContent>
              </Card>
            );
          })}
        </List>
      )}
    </Box>
  );
};

export default QuestionList;
