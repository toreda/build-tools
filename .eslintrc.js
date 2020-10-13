module.exports = {
  parser: "@typescript-eslint/parser", // Specifies the ESLint parser
  parserOptions: {
    ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
    sourceType: "module", // Allows for the use of imports
    ecmaFeatures: {
    }
  },
  settings: {
  },
  extends: [
    "@toreda/eslint-config"
  ],
  rules: {
  }
};