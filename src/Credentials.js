const UserInput = require('./UserInput');
require('dotenv').config();

class Credentials {
  static instance = null;

  #username;
  #password;
  #host;
  #localFolder;
  #remoteFolder;

  constructor() {
    if (Credentials.instance != null) {
      throw new Error(
        'There must not be more than one Credentials object and it has already been assigned'
      );
      return;
    }
    Credentials.instance = this;
  }

  get username() {
    return this.#username;
  }
  get password() {
    return this.#password;
  }
  get host() {
    return this.#host;
  }
  get localFolder() {
    return this.#localFolder;
  }
  get remoteFolder() {
    return this.#remoteFolder;
  }

  set username(val) {
    this.#username = val;
    return this;
  }
  set password(val) {
    this.#password = val;
    return this;
  }
  set host(val) {
    this.#host = val;
    return this;
  }
  set localFolder(val) {
    this.#localFolder = val;
    return this;
  }
  set remoteFolder(val) {
    this.#remoteFolder = val;
    return this;
  }

  envInput() {
    this.#username = process.env.UNAME;
    this.#password = process.env.PASSWORD;
    this.#host = process.env.HOST;
    this.#localFolder = process.env.LOCAL_FOLDER;
    this.#remoteFolder = process.env.REMOTE_FOLDER;
  }

  async userInput() {
    this.#username = await UserInput.ask('username: ');
    this.print();
    this.#password = await UserInput.ask('password: ');
    this.print();
    this.#host = await UserInput.ask('host: ');
    this.print();
    this.#remoteFolder = await UserInput.ask('remoteFolder: ');
    this.print();
    this.#localFolder = await UserInput.ask('localFolder: ');
    this.print();
  }

  print() {
    console.log({
      username: this.#username,
      password: this.#password,
      host: this.#host,
      remoteFolder: this.#remoteFolder,
      localFolder: this.#localFolder,
    });
  }
}

module.exports = Credentials;
