const UserInput = require("./UserInput");

class Credentials {
  static instance = null;

  #username
  #password
  #server
  #localFolder
  #remoteFolder

  constructor() {
    if (Credentials.instance != null) {
      throw new Error(
        "There must not be more than one Credentials object and it has already been assigned"
      );
      return;
    }
    Credentials.instance = this;
  }

  get username() {return this.#username}
  get password() {return this.#password}
  get server() {return this.#server}
  get localFolder() {return this.#localFolder}
  get remoteFolder() {return this.#remoteFolder}

  set username(val) {
    this.#username = val
    return this
  } 

  set password(val) {
    this.#password = val
    return this
  } 

  set server(val) {
    this.#server = val
    return this
  } 

  set localFolder(val) {
    this.#localFolder = val
    return this
  } 

  set remoteFolder(val) {
    this.#remoteFolder = val
    return this
  } 
  async complete() {
    this.#username = await UserInput.ask("username: ");
    this.print()
    this.#password = await UserInput.ask("password: ");
    this.print()
    this.#server = await UserInput.ask("server: ");
    this.print()
    this.#remoteFolder = await UserInput.ask("remoteFolder: ");
    this.print()
    this.#localFolder = await UserInput.ask("localFolder: ");
    this.print()
  }

  print() {
    console.log({
        username: this.#username,
        password: this.#password,
        server: this.#server,
        remoteFolder: this.#remoteFolder,
        localFolder: this.#localFolder,
    })
  }
}

module.exports = Credentials
