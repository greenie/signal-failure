import { KMS } from 'aws-sdk';

export default function getSecret(secret) {
  const kms = new KMS();

  return new Promise((resolve, reject) => {
    const params = { CiphertextBlob: new Buffer(process.env[secret], 'base64') };

    kms.decrypt(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.Plaintext.toString('ascii'));
      }
    });
  });
}
