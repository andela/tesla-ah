/* eslint-disable require-jsdoc */
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

class Tokenizer {
  static async generateToken(payload) {
    const token = await jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '10h' });

    return token;
  }

  static async decodeToken(token) {
    const user = await jwt.verify(token, process.env.SECRET_KEY);

    return user;
  }
}
export default Tokenizer;
