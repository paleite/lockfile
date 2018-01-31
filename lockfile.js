'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require('mz/fs');

var _fs2 = _interopRequireDefault(_fs);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _md = require('md5');

var _md2 = _interopRequireDefault(_md);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Sets up the Lockfile-object
 * @class
 * @classdesc A class to automatically read/write lockfiles.
 */
var Lockfile = function () {
  /**
   * Constructor
   * @param {string} name A name to use as a basis for the lockfile. (optional)
   */
  function Lockfile() {
    var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _fs2.default.realpathSync('.');

    _classCallCheck(this, Lockfile);

    this.lockfile = _path2.default.resolve(_os2.default.tmpdir(), (0, _md2.default)(_path2.default.normalize(name)) + '.lock');
  }

  /**
   * Create the lock
   * @param {boolean} force Force the class to create a lock.
   * @returns {Promise} Promise object represents whether locking was successful or not
   */


  _createClass(Lockfile, [{
    key: 'lock',
    value: function lock() {
      var _this = this;

      var force = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      if (force) {
        return this.writeLockfile();
      }

      return this.isAvailable().then(function () {
        return _this.writeLockfile();
      });
    }

    /**
     * Remove the lock
     * @returns {Promise} Promise object represents whether unlocking was successful or not
     */

  }, {
    key: 'unlock',
    value: function unlock() {
      return this.unlinkLockfile();
    }

    /**
     * Check if the lockfile is available (i.e. doesn't already exist)
     * @returns {Promise} Promise object represents whether the lockfile is available or not
     */

  }, {
    key: 'isAvailable',
    value: function isAvailable() {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        _fs2.default.exists(_this2.lockfile).then(function (exists) {
          if (exists) {
            reject(new Error('Lockfile already exists: ' + _this2.lockfile));
            return;
          }
          resolve();
        });
      });
    }

    /**
     * Write the lockfile to disk
     * @returns {Promise} Promise object represents whether writing the lockfile was successful or not
     */

  }, {
    key: 'writeLockfile',
    value: function writeLockfile() {
      return _fs2.default.writeFile(this.lockfile, '');
    }

    /**
     * Unlink the lockfile from disk
     * @returns {Promise} Promise object represents whether unlinking was successful or not
     */

  }, {
    key: 'unlinkLockfile',
    value: function unlinkLockfile() {
      return _fs2.default.unlink(this.lockfile);
    }
  }]);

  return Lockfile;
}();

exports.default = Lockfile;
