const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

class UserInput {
  static ask(question) {
    return new Promise((resolve, reject) => {
      readline.question(question, res => {
        if (res == undefined) {
          reject('There was a problem processing your input');
        } else {
          resolve(res);
        }
      });
    });
  }
}

module.exports = UserInput;
