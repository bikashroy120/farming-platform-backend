import express from 'express';

const router = express.Router();

router.get('/user', (req, res) => {
  res.send('Login route');
});

export default router;
