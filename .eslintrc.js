module.exports = {
    "plugins": [
        "react"
    ],
    "parserOptions": {
        "ecmaVersion": 7,
        "sourceType": "module",
        "ecmaFeatures": {
            "jsx": true
        }
    },
    "env": {
        "es6":     true,
        "browser": true,
        "node":    true,
        "mocha":   true,
        "jest": true
    },
    "parser": "babel-eslint",
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended"
    ],
    "rules": {
      "no-console": process.env.NODE_ENV === 'production' ? 2 : 0,
      "no-debugger": process.env.NODE_ENV === 'production' ? 2 : 0
    }
}
