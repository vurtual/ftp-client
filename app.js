const Credentials = require('./src/Credentials');
const FTP = require('./src/FTP');

function init() {
  assignCredentials();
}

async function assignCredentials() {
  const credentials = new Credentials();
  credentials.envInput();
  const connection = new FTP(credentials);
  await connection.connect();
  const files = await connection.list();
  console.log(files.map(f => f.name));

  connection.download(files[0].name);
}

init();
