//code coming from setup docs of mongoDB + chatGPT
const { MongoClient, ServerApiVersion } = require("mongodb");

  // Replace the placeholder connection string below with your
  // Altas cluster specifics. Be sure it includes
  // a valid username and password! Note that in a production environment,
  // you do not want to store your password in plain-text here.
  const uri =
    "mongodb+srv://sct:azertyuiop@familyrecipes.obygc6x.mongodb.net/?retryWrites=true&w=majority";

  // Create a MongoClient with a MongoClientOptions object to set the Stable API version
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });


async function connectToDb() {
    try {
      await client.connect();
    } catch (error) {
      console.error(error);
    }
  }

//by exporting the connect function, we can use it in other files
module.exports = { connectToDb, client };
