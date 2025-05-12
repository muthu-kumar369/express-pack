// src/utils/lodash-helper.js
import {
  get,
  set,
  merge,
  cloneDeep,
  isEmpty,
  omit,
  pick,
  uniqBy,
  debounce,
} from "lodash-es";

export class LodashHelper {
  /**
   * Safely get a value from a nested object path.
   *
   * @param {Object} obj - The object to query.
   * @param {string} path - Dot-notated path.
   * @param {*} defaultVal - Fallback value if path is undefined.
   * @returns {*} - The found value or default.
   *
   * @example LodashHelper.get({ a: { b: 1 } }, 'a.b', 0) // 1
   */
  static get(obj, path, defaultVal = undefined) {
    return get(obj, path, defaultVal);
  }

  /**
   * Set a value deeply in an object (mutates the original object).
   *
   * @param {Object} obj - The object to modify.
   * @param {string} path - Dot-notated path.
   * @param {*} value - Value to set.
   * @returns {Object} - Modified object.
   *
   * @example LodashHelper.set({}, 'user.name', 'John') // { user: { name: 'John' } }
   */
  static set(obj, path, value) {
    return set(obj, path, value);
  }

  /**
   * Deep merge multiple objects into one (mutates the target).
   *
   * @param {Object} target - The target object.
   * @param {...Object} sources - Objects to merge in.
   * @returns {Object} - Merged object.
   *
   * @example LodashHelper.merge({ a: 1 }, { b: 2 }) // { a: 1, b: 2 }
   */
  static merge(target, ...sources) {
    return merge(target, ...sources);
  }

  /**
   * Create a deep clone of a value.
   *
   * @param {*} value - Object or array to clone.
   * @returns {*} - Deeply cloned value.
   *
   * @example LodashHelper.cloneDeep({ a: 1 }) // { a: 1 }
   */
  static cloneDeep(value) {
    return cloneDeep(value);
  }

  /**
   * Check if a value is empty (array, object, string, etc.).
   *
   * @param {*} value - The value to check.
   * @returns {boolean}
   *
   * @example LodashHelper.isEmpty([]) // true
   */
  static isEmpty(value) {
    return isEmpty(value);
  }

  /**
   * Return a new object omitting specified keys.
   *
   * @param {Object} obj - Source object.
   * @param {string[]} keys - Keys to omit.
   * @returns {Object}
   *
   * @example LodashHelper.omit({ a: 1, b: 2 }, ['b']) // { a: 1 }
   */
  static omit(obj, keys) {
    return omit(obj, keys);
  }

  /**
   * Return a new object with only selected keys.
   *
   * @param {Object} obj - Source object.
   * @param {string[]} keys - Keys to include.
   * @returns {Object}
   *
   * @example LodashHelper.pick({ a: 1, b: 2 }, ['a']) // { a: 1 }
   */
  static pick(obj, keys) {
    return pick(obj, keys);
  }

  /**
   * Remove duplicates in an array of objects by a property.
   *
   * @param {Array} array - Array to filter.
   * @param {string} key - Unique key.
   * @returns {Array}
   *
   * @example LodashHelper.uniqBy([{ id: 1 }, { id: 1 }, { id: 2 }], 'id') // [ { id: 1 }, { id: 2 } ]
   */
  static uniqBy(array, key) {
    return uniqBy(array, key);
  }

  /**
   * Debounce a function (limits how often it's called).
   *
   * @param {Function} func - The function to debounce.
   * @param {number} wait - Milliseconds to wait.
   * @param {Object} options - debounce options.
   * @returns {Function}
   *
   * @example const fn = LodashHelper.debounce(() => console.log('Ping'), 300)
   */
  static debounce(func, wait, options = {}) {
    return debounce(func, wait, options);
  }

  /**
   * Get value by path or return default (wrapper around `get`).
   *
   * @param {Object} obj - The object to query.
   * @param {string} path - Dot-notated path.
   * @param {*} defaultVal - Default if undefined.
   * @returns {*}
   *
   * @example LodashHelper.getOrDefault({ a: null }, 'a.b', 'default') // 'default'
   */
  static getOrDefault(obj, path, defaultVal = null) {
    return get(obj, path, defaultVal);
  }

  /**
   * Check if multiple nested keys exist.
   *
   * @param {Object} obj - The object to check.
   * @param {string[]} paths - Array of dot-notated paths.
   * @returns {boolean}
   *
   * @example LodashHelper.hasNestedKeys({ a: { b: 1 } }, ['a.b']) // true
   */
  static hasNestedKeys(obj, paths = []) {
    return paths.every((p) => get(obj, p) !== undefined);
  }

  /**
   * Clone an object and set a value deeply (without mutation).
   *
   * @param {Object} obj - Original object.
   * @param {string} path - Path to set.
   * @param {*} value - Value to set.
   * @returns {Object} - New object with updated value.
   *
   * @example LodashHelper.deepCloneAndSet({ a: 1 }, 'b.c', 2) // { a: 1, b: { c: 2 } }
   */
  static deepCloneAndSet(obj, path, value) {
    const cloned = cloneDeep(obj);
    set(cloned, path, value);
    return cloned;
  }

  /**
   * Remove null, undefined, or empty string values from an object.
   *
   * @param {Object} obj - Object to filter.
   * @returns {Object}
   *
   * @example LodashHelper.compactObject({ a: null, b: '', c: 'ok' }) // { c: 'ok' }
   */
  static compactObject(obj) {
    return Object.fromEntries(
      Object.entries(obj).filter(
        ([, val]) => val !== null && val !== undefined && val !== ""
      )
    );
  }
}
