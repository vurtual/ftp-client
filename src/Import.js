const fs = require('fs');

class Import {
  static instance = [];
  #filename;

  constructor(filename, directory, createDate) {
    this.#filename = filename;
    this.#directory = directory;
    this.#importDate = Date.now();
    this.#createDate = createDate;
    this.#id = this.#filename.substring(1, 8);
    this.renameFile();
    this.unzipFile();
  }

  renameFile() {
    fs.rename(
      `./${this.directory}/${this.#filename}`,
      `./${this.directory}//${this.#id}.zip`,
      err => {
        if (err) throw err;
        console.log('Rename complete!');
      }
    );
  }

  unzipFile() {
    fs.createReadStream(`./${this.directory}/${this.#id}.zip`)
      .pipe(unzipper.Extract({ path: `./${this.directory}` }))
      .on('close', () => {
        console.log('File unzipped');
      });
  }
}

module.exports = Import;
