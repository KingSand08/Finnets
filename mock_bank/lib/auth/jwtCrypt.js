'use server';
import { jwtVerify, SignJWT } from 'jose';

const secretKey = 'secret';
const key = new TextEncoder().encode(secretKey);

export async function jwtDecrypt(input) {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ['HS256'],
  });
  return payload;
}

export async function jwtEncrypt(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('2hr')
    .sign(key);
}
