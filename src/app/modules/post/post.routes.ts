import express from 'express';
import { PostController } from './post.controller';
import { PostValidation } from './post.validation';
import validateRequest from '../../middlewares/validateRequest';
import { authMiddlewares } from '../../middlewares/auth';

const router = express.Router();

router.post(
  '/',
  authMiddlewares.auth(),
  validateRequest(PostValidation.createPostZodSchema),
  PostController.createPost,
);

router.get('/', PostController.getAllPosts);
router.get('/:id', PostController.getSinglePost);

router.delete('/:id', authMiddlewares.auth(), PostController.deletePost);

export const PostRoutes = router;
