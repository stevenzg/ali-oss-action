/**
 * Copied some code from:
 * https://github.com/hustcc/aliyun-oss-deploy
 */

const core = require('@actions/core')
const path = require('path')
const fs = require('fs')
const globby = require('globby')
const OSS = require('ali-oss')

const fileList = filePath =>
  fs.statSync(filePath).isFile()
    ? [filePath]
    : globby.sync(['**/*.*'], { cwd: filePath })

void (async function() {
  try {
    const region = core.getInput('region')
    const accessKeyId = core.getInput('accessKeyId')
    const accessKeySecret = core.getInput('accessKeySecret')
    const bucket = core.getInput('bucket')
    const bucketPath = core.getInput('bucketPath')
    const filePath = core.getInput('filePath')

    const client = new OSS({
      region,
      accessKeyId,
      accessKeySecret,
      bucket
    })

    const pageFilesPath = path.resolve(filePath)
    const files = fileList(pageFilesPath)

    let successCount = 0
    let failCount = 0
    for (const file of files) {
      const ossTarget = path.join(bucketPath, file)
      const stream = fs.createReadStream(path.join(pageFilesPath, file))
      const result = await client.put(ossTarget, stream, {
        timeout: 7200000
      })
      console.log('Result:', result)
      if (result.res.status === 200) {
        ++successCount
      } else {
        ++failCount
      }
    }

    core.setOutput('successCount', successCount)
    core.setOutput('failCount', failCount)
  } catch (error) {
    core.setFailed(error.message)
  }
})()
