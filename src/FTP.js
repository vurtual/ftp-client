const { log } = require('console');
const Client = require('ftp');
const path = require('path');
const fs = require('fs');
const { writeStream } = require('fs');

class FTP {
  static #timeout = 1000 * 10;
  #username;
  #password;
  #host;
  #localFolder;
  #remoteFolder;
  #port;
  #lastInteraction;

  constructor(credentials) {
    this.#username = credentials.username;
    this.#password = credentials.password;
    this.#host = credentials.host;
    this.#localFolder = credentials.localFolder;
    this.#remoteFolder = credentials.remoteFolder;
    this.#port = credentials.port;
  }

  getStatus() {
    return new Promise((resolve, reject) => {
      this.connection.status((err, status) => {
        if (err) {
          reject('Error getting status:', err);
        }
        if (!status) {
          reject('No status');
        }
        resolve(status.split('\n')[1]);
      });
    });
  }

  async connectIfDisconnected() {
    const status = await this.getStatus();
    if (!(await status.match(new RegExp(/Connected/g)))) {
      console.log(await status, 'Attempting to reconnect.');
      this.connect();
    }
  }

  async tick() {
    this.untick();
    this.#lastInteraction = Date.now();
    this.interval = setInterval(async () => {
      if (Date.now() - this.#lastInteraction > FTP.#timeout) {
        this.close();
      }
    }, 1000);
  }

  untick() {
    console.log('untick');
    if (this.interval) clearInterval(this.interval);
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.connection = new Client();
      this.connection.connect({
        host: this.#host,
        user: this.#username,
        password: this.#password,
      });
      this.connection.on(
        'greeting',
        async msg => {
          console.log(msg);
          this.tick();
          resolve();
        },
        err => {
          reject({ err });
        }
      );
    });
  }

  async list() {
    await this.connectIfDisconnected();
    console.log(await this.getStatus());
    return new Promise((resolve, reject) => {
      this.connection.list(this.#remoteFolder, (err, list) => {
        if (err) reject({ err });
        this.tick();
        resolve(list);
      });
    });
  }

  async download({ filename, isTemp }) {
    await this.connectIfDisconnected();
    console.log('Download', await this.getStatus());
    const remoteFullPath = path.join(this.#remoteFolder, filename);
    const tempFolder = path.join(this.#localFolder, 'tmp');
    const tempPath = path.join(tempFolder, filename);
    if (isTemp && !fs.existsSync(temp)) {
      fs.createFolder(path.join(temp));
    }
    const localFullPath = isTemp
      ? tempPath
      : path.join(this.#localFolder, filename);

    console.log('localFullPath', localFullPath);

    this.connection.cwd(this.#remoteFolder, (err, currentDir) => {
      if (err) {
        return err;
      } else {
        this.connection.get(filename, (err, stream) => {
          if (err) {
            console.error(`Error downloading ${remoteFullPath}:`, err);
            return;
          }
          this.tick();
          const writeStream = fs.createWriteStream(localFullPath);
          stream.pipe(stream, writeStream);
        });
      }
    });
  }

  async close() {
    this.untick();
    console.log('Closing connection');
    await this.connection.end();
    console.log('Connection closed');
  }
}

module.exports = FTP;
