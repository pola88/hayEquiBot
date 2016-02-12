import _ from "lodash";

let customMatchers = {

  toBeBlank() {
    return {
      compare: function(actual) {
        var result = {};

        result.pass = _.isNull(actual) || _.isUndefined(actual) || actual === "";

        if(!result.pass) {
          result.message = `Expected ${actual} to be blank`;
        }

        return result;
      }
    };
  },

  toBeOfType() {
    return {
      compare: function(actual, expected) {
        var result = {};

        if(expected.toLowerCase() === "array") {
          result.pass = (actual instanceof Array);
        } else {
          result.pass = (typeof actual) === expected;
        }

        return result;
      }
    };
  },

  has() {
    return {
      compare: function(actual, expected) {
        var result = {};

        result.message = `Expected ${jasmine.pp(actual)} to has '${expected}' key.`;

        result.pass = !_.isUndefined(actual[expected]);

        return result;
      }
    };
  },

  toContains() {
    return {
      compare: function(actual, expected) {
        var result = {};

        result.messge = `Expected ${jasmine.pp(actual)} to contains '${expected}'.`;

        result.pass = _.include(actual, expected);

        return result;
      }
    };
  }
};

module.exports = customMatchers;
