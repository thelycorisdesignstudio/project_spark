import bcrypt from 'bcryptjs';

const PASSWORD_SALT_ROUNDS = 12;
const PIN_SALT_ROUNDS = 10;

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, PASSWORD_SALT_ROUNDS);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const hashPin = async (pin: string): Promise<string> => {
  return bcrypt.hash(pin, PIN_SALT_ROUNDS);
};

export const comparePin = async (pin: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(pin, hash);
};
