import dotenv from 'dotenv';
import password from './hashHelper';

dotenv.config();

const hashed = password.hashPassword(process.env.SUPER_ADMIN_PSW);

export default hashed;
