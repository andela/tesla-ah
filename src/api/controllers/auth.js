import models from '../../sequelize/models';
import token from '../helpers/Token.helper';

const { User } = models;
const { generateToken } = token;

export default {
  signup: async (req, res) => {
    const { email, username, bio } = req.body;
    const { dataValues } = await User.create({
      email,
      username,
      bio
    });

    dataValues.token = await generateToken(dataValues);
    res.status(201).send({
      status: res.statusCode,
      data: dataValues
    });
  }
};
