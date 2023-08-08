const Credentials = require("./src/Credentials")

function init() {
  assignCredentials()
}

async function assignCredentials() {
  const credentials = new Credentials()
  await credentials.complete()
  credentials.print()
}

init()