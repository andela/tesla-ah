/* eslint-disable require-jsdoc */
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

class Tokenizer {
  static async generateToken(user) {
    const { id } = user;
    const token = await jwt.sign({ userId: id }, process.env.SECRET_KEY, { expiresIn: '2 days' });

    return token;
  }

  static async decodeToken(token) {
    const user = await jwt.verify(token, process.env.SECRET_KEY);

    return user;
  }
}


export default Tokenizer;
