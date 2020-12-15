/**
 * Snce Uploader object
 * Upload files from given folder on AWS S3 bucket
 * @param {string} type - type of credentials to be used (PROFILE: use AWS profile, ENV: use key and secret from .env file)
 * @param {string} profile - profile name to be used for login using AWS profile (optional)
 */
module.exports = function (type, profile = '') {
  const helper = require('./modules/_s3-helper');
  this.credentialType = type
  this.profileName = profile
  this.accessData = helper.getAccessData(this.credentialType, this.profileName)

  /**
   * Upload files from given folder on AWS S3 bucket
   * @param {string} buildFolder folder to be uploaded.
   * @param {string} releaseName name of the release to be used (optional) fallback is the string into MANIFEST file.
   * @param {string[]} compressedFileExt list of file extension gzipped in order to set right content encoding value (optional)
   */
  this.upload = function upload(buildFolder, releaseName = '', compressedFileExt = []) {
    const uploader = require('./modules/_s3-uploader');
    console.log('> Upload on AWS S3 Bucket Start')
    uploader.run(buildFolder, this.accessData, this.credentialType, releaseName, compressedFileExt).then(() => {
      console.log('> Upload on AWS S3 Bucket End')
      process.exit(0)
      return true
    })
      .catch(err => {
        console.error(err.message)
        process.exit(1)
        return false
      })
  }
}