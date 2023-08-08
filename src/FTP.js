const { log } = require('console');
const Client = require('ftp');
const path = require('path');
const fs = require('fs');

class FTP {
  #username;
  #password;
  #host;
  #localFolder;
  #remoteFolder;
  #isConnected;

  constructor(credentials) {
    this.#isConnected = false;
    this.#username = credentials.username;
    this.#password = credentials.password;
    this.#host = credentials.host;
    this.#localFolder = credentials.localFolder;
    this.#remoteFolder = credentials.remoteFolder;
  }

  get isConnected() {
    return this.#isConnected;
  }

  download(filename) {
    const remoteFullPath = path.join(this.#remoteFolder, filename);
    const localFullPath = path.join(this.#localFolder, filename);
    console.log(`Downloading ${remoteFullPath} to ${localFullPath}}`);
    this.connection.get(remoteFullPath, (err, stream) => {
      if (err) throw err;
      stream.once('close', () => {
        console.log(`Downloaded ${remoteFullPath}`);
        this.close();
      });
      pipe.stream(stream, fs.createWriteStream(localFullPath));
      return this;
    });
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.connection = new Client();
      this.connection.connect({
        host: this.#host,
        user: this.#username,
        password: this.#password,
      });
      this.connection.on('greeting', msg => console.log(msg));
      this.connection.on('ready', () => {
        this.#isConnected = true;
        resolve();
      });
    });
  }

  list() {
    return new Promise((resolve, reject) => {
      this.connection.list(this.#remoteFolder, (err, list) => {
        if (err) reject({ err });
        resolve(list);
      });
    });
  }

  close() {
    this.connection.close();
    this.destroy();
  }
}

module.exports = FTP;
