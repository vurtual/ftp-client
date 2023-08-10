const Credentials = require('./src/Credentials');
const FTP = require('./src/FTP');

async function init() {
  const credentials = assignCredentials();
  // const connection = await connect(credentials);
  // const files = await list(connection, true);
  // downloadAll(files, connection);
}

function assignCredentials() {
  const credentials = new Credentials();
  credentials.envInput();

  return credentials;
}

async function connect(credentials) {
  const connection = new FTP(credentials);
  await connection.connect();
  return connection;
}

async function list(connection, doPrint = false) {
  const files = await connection.list();
  if (doPrint) {
    console.log(files);
  }
  return files;
}

async function downloadAll(files, connection) {
  recurseDownload(files, connection, 0);
}

async function recurseDownload(files, connection, index) {
  if (index < files.length) {
    if (files[index]?.type === 'd') console.log('Folder', files[index].name);
    if (files[index]?.type === '-') await download(files[index], connection);
    recurseDownload(files, connection, ++index);
  }
}

async function download(file, connection) {
  if (file?.name && file?.type === '-') {
    const filename = file.name;
    await connection.download({ filename, isTemp: false });
  }
  return;
}

init();
