# ali-oss-action

Deploy static pages to Ali OSS

## Inputs

### `region`

**Required** oss region.

### `accessKeyId`

**Required** Your accessKeyId.

### `accessKeySecret`

**Required** Your accessKeySecret.

### `bucket`

**Required** Your bucket name.

### `bucketPath`

Directory under bucket.

### `filePath`

**Required** File directory to be uploaded. Default `"dist"`.

## Outputs

### `successCount`

Success Count.

### `failCount`

Fail Count.

## Example usage

```yaml
name: 'deploy-to-ali-oss'
on:
  push:
    branches:
      - master

jobs:
  ali_oss_deploy:
    runs-on: ubuntu-latest
    name: Deploy Pages to Ali OSS
    steps:
      - name: Checkout
        uses: actions/checkout@master
      - run: yarn install
      - run: yarn build
      - name: Deploy
        id: DeployOss
        uses: stevenzg/ali-oss-action@master
        with:
          region: ${{ secrets.region }}
          accessKeyId: ${{ secrets.accessKeyId }}
          accessKeySecret: ${{ secrets.accessKeySecret }}
          bucket: ${{ secrets.bucket }}
          filePath: 'dist'
      - name: Deploy Result
        run: echo "${{ steps.DeployOss.outputs.successCount }} success, ${{ steps.DeployOss.outputs.failCount }} fail."
```
