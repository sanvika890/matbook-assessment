import { webcrypto } from 'crypto';

const { randomBytes } = webcrypto;
const secret = Buffer.from(randomBytes(64)).toString('hex');
console.log('Generated JWT Secret:');
console.log(secret);
