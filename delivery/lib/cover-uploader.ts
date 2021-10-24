import { S3 } from 'aws-sdk'
import { PutObjectRequest } from 'aws-sdk/clients/s3'
import { createReadStream } from 'fs'
import { basename } from 'path'

const s3Client = new S3({ region: 'eu-west-2' })
const bucketName = process.env.S3_COVERS_BUCKET_NAME as string

export class CoverUploader {
  constructor (
    private client = s3Client,
    private bucket = bucketName,
    private createStream = createReadStream,
    private getBaseName = basename
  ) {}

  async upload (path: string): Promise<void> {
    const params = this.params(path)
    await this.client.upload(params).promise()
  }

  private params (path: string): PutObjectRequest {
    const stream = this.createStream(path)
    stream.on('error', err => {
      throw err
    })

    return {
      Bucket: this.bucket,
      Key: this.getBaseName(path),
      Body: stream,
      ContentType: 'image/png',
      CacheControl: 'max-age=31536000, immutable'
    }
  }
}
