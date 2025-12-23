import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Card,
  CardContent,
  Chip,
  Box
} from '@mui/material';

const QuestionList = ({ questions }) => {
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
        <List>
          {questions.map((question) => (
            <Card key={question.id} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" component="h3">
                  {question.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {question.description}
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Chip
                    label={`Answers: ${question.answers?.length || 0}`}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                  <Typography variant="caption" color="text.secondary">
                    Asked by: {question.author}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          ))}
        </List>
      )}
    </Box>
  );
};

export default QuestionList;
