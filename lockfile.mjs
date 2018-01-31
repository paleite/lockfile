import fs from 'mz/fs'
import os from 'os'
import md5 from 'md5'
import path from 'path'

/**
 * Sets up the Lockfile-object
 * @class
 * @classdesc A class to automatically read/write lockfiles.
 */
export default class Lockfile {
  /**
   * Constructor
   * @param {string} name A name to use as a basis for the lockfile. (optional)
   */
  constructor (name = fs.realpathSync('.')) {
    this.lockfile = path.resolve(
      os.tmpdir(),
      `${md5(path.normalize(name))}.lock`
    )
  }

  /**
   * Create the lock
   * @param {boolean} force Force the class to create a lock.
   * @returns {Promise} Promise object represents whether locking was successful or not
   */
  lock (force = false) {
    if (force) {
      return this.writeLockfile()
    }

    return this.isAvailable().then(() => {
      return this.writeLockfile()
    })
  }

  /**
   * Remove the lock
   * @returns {Promise} Promise object represents whether unlocking was successful or not
   */
  unlock () {
    return this.unlinkLockfile()
  }

  /**
   * Check if the lockfile is available (i.e. doesn't already exist)
   * @returns {Promise} Promise object represents whether the lockfile is available or not
   */
  isAvailable () {
    return new Promise((resolve, reject) => {
      fs.exists(this.lockfile).then(exists => {
        if (exists) {
          reject(new Error(`Lockfile already exists: ${this.lockfile}`))
          return
        }
        resolve()
      })
    })
  }

  /**
   * Write the lockfile to disk
   * @returns {Promise} Promise object represents whether writing the lockfile was successful or not
   */
  writeLockfile () {
    return fs.writeFile(this.lockfile, '')
  }

  /**
   * Unlink the lockfile from disk
   * @returns {Promise} Promise object represents whether unlinking was successful or not
   */
  unlinkLockfile () {
    return fs.unlink(this.lockfile)
  }
}
