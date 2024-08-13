import bcrypt from 'bcrypt';
import config from '../config';

const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, Number(config.salt_round));
};

export default hashPassword;
