import db from '../../sequelize/models';

const { Opt } = db;

/**
 * @class
 */
class OptController {
  /**
   * @description User should be able  to
   * @param {Object} req Request object
   * @param {Object} res  Response object
   * @returns {Object} Response object
   */
  static async OptInApp(req, res) {
    const { id } = req.user;
    const optedin = await Opt.findOne({
      where: {
        userId: id,
        type: 'inapp'
      }
    });
    if (optedin) {
      return res.status(400).json({
        message: 'You are already opted-in'
      });
    }
    const newOpt = await Opt.create({
      userId: id,
      type: 'inapp'
    });
    if (newOpt) {
      res.status(201).json({
        message: 'You are now opted-in to in-app notifications',
        data: newOpt
      });
    }
  }

  /**
  * @description User should subscribe with email
  * @param {Object} req Request object
  * @param {Object} res Response object
  * @returns {Object} Response object
  */
  static async OptInEmail(req, res) {
    const { id } = req.user;
    const optedin = await Opt.findOne({
      where: {
        userId: id,
        type: 'email'
      }
    });
    if (optedin) {
      return res.status(400).json({
        message: 'You are already opted in'
      });
    }

    const newOpt = await Opt.create({
      userId: id,
      type: 'email'
    });
    if (newOpt) {
      res.status(201).json({
        message: 'You are now opted-in for receiving email notifications',
        data: newOpt
      });
    }
  }

  /**
   * @description User should be able to opt-out in-app notifications
   * @param {Object} req Request Object
   * @param {Object} res Response Object
   * @returns {Object} Response object
   */
  static async optOutApp(req, res) {
    const { id } = req.user;
    const optedin = await Opt.findOne({
      where: {
        userId: id,
        type: 'inapp'
      }
    });
    if (optedin) {
      await Opt.destroy({
        where: {
          userId: id,
          type: 'inapp'
        }
      });
      return res.json({
        message: 'You are now opted-out!'
      });
    }
    res.status(400).json({
      message: 'You are not opted-in with in-app'
    });
  }

  /**
   * @description User should be able to opt-out email notifications
   * @param {Object} req Request object
   * @param {Object} res Response object
   * @returns {Object} Response object
   */
  static async optOutEmail(req, res) {
    const { id } = req.user;
    const optedin = await Opt.findOne({
      where: {
        userId: id,
        type: 'email'
      }
    });
    if (optedin) {
      await Opt.destroy({
        where: {
          userId: id,
          type: 'email'
        }
      });

      return res.json({
        message: 'You are now opted-out!'
      });
    }

    res.status(400).json({
      message: 'You are not yet opted in with email'
    });
  }
}

export default OptController;
