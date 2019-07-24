import { Router } from 'express';
import CategoryController from '../controllers/category';
import validateBody from '../../middleware/validateBody';
import Auth from '../../middleware/auth';

const categoryRouter = Router();
const { verifyToken, checkIsAdmin } = Auth;
const {
  createCategory,
  editCategory,
  deleteCategory,
  getAllCategory,
  fetchAllArticles
} = CategoryController;

categoryRouter.post(
  '/',
  verifyToken,
  checkIsAdmin,
  validateBody('category'),
  createCategory
);
categoryRouter.put('/:id', verifyToken, checkIsAdmin, editCategory);
categoryRouter.delete('/:id', verifyToken, checkIsAdmin, deleteCategory);
categoryRouter.get('/', getAllCategory);
categoryRouter.get('/:categoryName/articles', fetchAllArticles);
export default categoryRouter;
