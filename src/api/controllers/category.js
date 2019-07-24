import models from '../../sequelize/models';

const { Category, Article } = models;
/**
 * @Author - Audace Uhiriwe
 */
class categoryController {
  /**
   * Admin - create a new category
   * @param {object} req - Request.
   * @param {object} res - Response.
   * @returns {object} - returns a created article
   */
  static async createCategory(req, res) {
    // check if the category exists
    const { categoryName } = req.body;
    const categoryExists = await Category.findOne({ where: { categoryName } });
    if (categoryExists) {
      return res.status(400).send({ error: 'This category is already Exist!' });
    }
    const data = await Category.NewCategory(req.body);
    return res.status(201).send({
      message: `This category of ${categoryName} has been successfully added!`,
      data
    });
  }

  /**
   * Admin - edit an existing category
   * @param {object} req - Request.
   * @param {object} res - Response.
   * @returns {object} - returns an updated article
   */
  static async editCategory(req, res) {
    // check if the category exists
    const { categoryName } = req.body;
    const { id } = req.params;
    const categoryExists = await Category.findAll({ where: { id } });
    if (categoryExists[0].dataValues.categoryName === categoryName) {
      return res.status(400).send({
        error: 'This category is already exists, Nothing you changed!'
      });
    }
    if (categoryExists === null) {
      return res.status(404).send({ error: 'This category Not found!' });
    }
    const updateCategory = {
      categoryName: categoryName || categoryExists[0].dataValues.categoryName
    };
    await Category.EditCategory(
      updateCategory,
      categoryExists[0].dataValues.id
    );
    return res.status(200).send({
      message: `This category of ${categoryExists[0].dataValues.categoryName} has been successfully updated to ${categoryName}!`
    });
  }

  /**
   * Admin - delete an existing category
   * @param {object} req - Request.
   * @param {object} res - Response.
   * @returns {object} - returns a message
   */
  static async deleteCategory(req, res) {
    const { id } = req.params;
    // check if the category exists
    const categoryExists = await Category.findOne({ where: { id } });
    if (categoryExists === null) {
      return res.status(404).send({ error: 'This category Not found!' });
    }
    await Category.destroy({ where: { id } });
    return res.status(200).send({
      message: 'This category has been successfully deleted!'
    });
  }

  /**
   * Admin - fetch all categories
   * @param {object} req - Request.
   * @param {object} res - Response.
   * @returns {object} - returns an array of all categories
   */
  static async getAllCategory(req, res) {
    const categories = await Category.findAll();
    if (categories === null) {
      return res.status(200).send({ message: 'No Categories found, so far!' });
    }
    return res.status(200).send({
      message: 'Here\'s all categories, so far!',
      categories
    });
  }

  /**
   * Admin - fetch all articles related to a specific category
   * @param {object} req - Request.
   * @param {object} res - Response.
   * @returns {object} - returns an array which contains all articles related to a specific category
   */
  static async fetchAllArticles(req, res) {
    const { categoryName } = req.params;
    const category = await Category.findOne({ where: { categoryName } });
    if (category === null) {
      return res.status(404).send({ message: 'This Category Not found!' });
    }
    const articles = await Article.findAll({ where: { categoryName } });
    if (!articles[0]) {
      return res.status(200).send({ message: 'No Articles found with this Category, so far!' });
    }
    return res.status(200).send({
      message: 'Here\'s all articles related to that category, so far!',
      articles
    });
  }
}

export default categoryController;
