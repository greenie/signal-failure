import { KMS } from 'aws-sdk'

const getSecret = async secret => {
  const kms = new KMS()
  const params = { CiphertextBlob: Buffer.from(process.env[secret], 'base64') }

  try {
    const { Plaintext } = await kms.decrypt(params).promise()
    return Plaintext.toString('ascii')
  } catch (error) {
    throw error
  }
}

export default getSecret
