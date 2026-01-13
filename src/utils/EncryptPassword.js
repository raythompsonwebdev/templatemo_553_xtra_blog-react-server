import bcrypt from "bcrypt";
// import { v4 as uuid } from "uuid";

async function hashPassword(plaintextPassword) {
  // const salt = uuid();
  // const pepper = process.env.PEPPER_STRING;

  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);

  const hash = await bcrypt.hash(plaintextPassword, salt);
  // Store hash in the database
  return hash;
}

async function comparePassword(plaintextPassword, hash) {
  const result = await bcrypt.compare(plaintextPassword, hash);
  return result;
}

export { hashPassword, comparePassword };
