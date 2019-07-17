/**
 * @Author - Mireille Niwemuhuza
 */
class shareHighlightController {
  /**
    *  @param {object} req
    * @param {object} res
    * @returns {object} Object representing the response returned
   */

  // eslint-disable-next-line require-jsdoc
  static async shareHighlights(req, res) {
    return res.status(200).json({
      message: 'Highlight shared!',
    });
  }
}

export default shareHighlightController;
