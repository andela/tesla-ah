import models from '../../sequelize/models';

const {
  termsAndCondition
} = models;

/**
 * @Author - Mireille Niwemuhuza
 */
export default class termsAndConditions {
/**
*  @description - Users should be able to get terms and conditions before signing up
*  @param {object} req - Request object
*  @param {object} res - Response object
*  @return {object} - Response object
*/
  static async getTermsAndConditions(req, res) {
    const { id } = req.params;
    const terms = await termsAndCondition.findOne({
      where: {
        id
      }
    });
    if (terms) {
      return res.status(200).json({
        data: terms
      });
    }
    return res.status(404).json({
      message: 'Terms and Conditions not found!'
    });
  }

  /**
  *  @description - Admin should be able to update terms and conditions
  *  @param {object} req - Request object
  *  @param {object} res - Response object
  *  @return {object} - Response object
  */
  static async updateTermsAndConditions(req, res) {
    const { id } = req.params;
    const termsConditions = await termsAndCondition.update({
      termsAndConditions: req.body.termsAndConditions
    }, { where: { id }, returning: true });
    return res.status(200).json({
      message: 'Terms and Conditions Updated!',
      data: termsConditions[1][0]
    });
  }
}
