import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  CssBaseline,
  ThemeProvider,
  createTheme,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions
} from '@mui/material';
import { ref, push, set, onValue } from 'firebase/database';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './firebase';
import QuestionList from './components/QuestionList';
import AddQuestion from './components/AddQuestion';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const [questions, setQuestions] = useState([]);
  const [user, setUser] = useState(null);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const questionsRef = ref(db, 'questions/');

    const unsubscribe = onValue(questionsRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        const questionsData = Object.entries(data).map(([id, question]) => ({
          id,
          ...question
        }));
        setQuestions(questionsData);
      } else {
        setQuestions([]);
      }
    }, (error) => {
      console.error('Error loading questions:', error);
      alert('Error loading questions: ' + error.message);
    });

    return () => unsubscribe();
  }, []);

  const handleAddQuestion = async (questionData) => {
    try {
      const questionsRef = ref(db, 'questions/');
      const newQuestionRef = push(questionsRef);
      await set(newQuestionRef, {
        ...questionData,
        author: user?.email || 'Anonymous',
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error adding question:', error);
      alert('Error adding question: ' + error.message);
    }
  };

  const handleAuth = async () => {
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      setAuthDialogOpen(false);
      setEmail('');
      setPassword('');
    } catch (error) {
      console.error('Authentication error:', error);
      alert(error.message);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            QueryNest
          </Typography>
          {user ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body1">
                Welcome, {user.email}
              </Typography>
              <Button color="inherit" onClick={handleSignOut}>
                Sign Out
              </Button>
            </Box>
          ) : (
            <Box>
              <Button color="inherit" onClick={() => { setIsSignUp(false); setAuthDialogOpen(true); }}>
                Sign In
              </Button>
              <Button color="inherit" onClick={() => { setIsSignUp(true); setAuthDialogOpen(true); }}>
                Sign Up
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <QuestionList questions={questions} />
        {user && <AddQuestion onAddQuestion={handleAddQuestion} />}
      </Container>

      <Dialog open={authDialogOpen} onClose={() => setAuthDialogOpen(false)}>
        <DialogTitle>{isSignUp ? 'Sign Up' : 'Sign In'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAuthDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAuth} variant="contained">
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}

export default App;