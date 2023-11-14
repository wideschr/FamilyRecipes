//code coming from setup docs of mongoDB
const { MongoClient, ServerApiVersion } = require("mongodb");

async function run() {
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

  // Connect the client to the server	(optional starting in v4.7)
  await client.connect();

  //Provide the name of the database and collection you want to use.
  // If the database and/or collection do not exist, the driver and Atlas
  // will create them automatically when you first write data.
  const dbName = "FamilyRecipes";
  const collectionNameRecipes = "recipes";

  // Create references to the database and collection in order to run
  // operations on them.
  const database = client.db(dbName);
  const collectionRecipes = database.collection(collectionNameRecipes);

  /*
   *  *** INSERT DOCUMENTS ***
   *
   * You can insert individual documents using collection.insert().
   * In this example, we're going to create four documents and then
   * insert them all in one call with collection.insertMany().
   */

  const recipes = [
    {
      title: "elotes",
      ingredients: [
        { name: "corn", quantity: 4 },
        { name: "mayonnaise", quantity: "1/4 cup" },
        { name: "cotija cheese", quantity: "1/4 cup" },
        { name: "sour cream", quantity: "1/4 cup" },
        { name: "lime", quantity: 1 },
      ],
      prepTimeInMinutes: 35,
      summary: "Mexican street corn",
      instructions: "Grill corn. Mix ingredients. Enjoy.",
      category: "vegetarian",
      picture_url: "https://www.simplyrecipes.com/recipes/elotes_mexican_grilled_corn/",
      difficulty: "easy",
      servings: 4,
      author: { name: "Pepe poes", email: "pepe@poes.be"},
      comments: [
        { name: "Pepe poes", message: "lorem ipsum dolor estlorem ipsum dolor estlorem ipsum dolor estlorem ipsum dolor est"},
        { name: "Meme poes", message: "lorem ipsum dolor estlorem ipsum dolor estlorem ipsum dolor estlorem ipsum dolor est"},
        { name: "Pepe Constant", message: "lorem ipsum dolor estlorem ipsum dolor estlorem ipsum dolor estlorem ipsum dolor est"},
    ],
    },
    {
      title: "loco moco",
      ingredients: [
        { "ground beef": "500g" },
        { "butter": "2 tbsp" },
        { "onion": 1 },
        { "egg": 2 },
        { "bread bun": 2 },
        { "mushrooms": "100g" },
    ],
      prepTimeInMinutes: 54,
      summary: "Hawaiian burger with gravy",
      instructions: "Grill beef. Fry egg. Fry mushrooms. Assemble. Enjoy.",
      category: "meat",
      picture_url: "https://www.simplyrecipes.com/recipes/loco_moco/",
      difficulty: "medium",
      servings: 2,
      author: { name: "Meme titine", email: "meme@titine.be"},
      comments: [
        { name: "Pepe poes", message: "lorem ipsum dolor estlorem ipsum dolor estlorem ipsum dolor estlorem ipsum dolor est"},
        { name: "Meme poes", message: "lorem ipsum dolor estlorem ipsum dolor estlorem ipsum dolor estlorem ipsum dolor est"},
        { name: "Pepe Constant", message: "lorem ipsum dolor estlorem ipsum dolor estlorem ipsum dolor estlorem ipsum dolor est"},
    ],
    },
    {
      title: "patatas bravas",
      ingredients: [
        { "potato": 2 },
        { "tomato": 4 },
        { "olive oil": 2 },
        { "onion": 1 },
        { "garlic": 2 },
        { "paprika": 1 },
    ],
      prepTimeInMinutes: 80,
      summary: "Spanish fried potatoes with spicy tomato sauce",
      instructions: "Fry potatoes. Fry onion and garlic. Mix with tomato and paprika. Enjoy.",
      category: "meat",
      picture_url: "https://www.simplyrecipes.com/recipes/patatas_bravas/",
      difficulty: "medium",
      servings: 2,
      author: { name: "Pepe constant", email: "pepe@cnstnt.be"},
      comments: [
        { name: "Pepe poes", message: "lorem ipsum dolor estlorem ipsum dolor estlorem ipsum dolor estlorem ipsum dolor est"},
        { name: "Meme poes", message: "lorem ipsum dolor estlorem ipsum dolor estlorem ipsum dolor estlorem ipsum dolor est"},
        { name: "Pepe Constant", message: "lorem ipsum dolor estlorem ipsum dolor estlorem ipsum dolor estlorem ipsum dolor est"},
        ],
    },
    {
      title: "fried rice",
      ingredients: [
        { "rice": "500g" },
        { "soy sauce": "2 tbsp" },
        { "egg": 2 },
        { "onion": 1 },
        { "pea": "100g" },
        { "carrot": "100g" },
        { "sesame oil": "1 tbsp" },
    ],
      prepTimeInMinutes: 40,
      summary: "Chinese fried rice",
      instructions: "Cook rice. Fry onion, egg, pea, carrot. Mix with rice. Enjoy.",
      category: "vegetarian",
      picture_url: "https://www.simplyrecipes.com/recipes/fried_rice/",
      difficulty: "easy",
      servings: 6,
      author: { name: "Pepe poes", email: "Sct@ehb.be"},
      comments: [
            { name: "Pepe poes", message: "lorem ipsum dolor estlorem ipsum dolor estlorem ipsum dolor estlorem ipsum dolor est"},
            { name: "Meme poes", message: "lorem ipsum dolor estlorem ipsum dolor estlorem ipsum dolor estlorem ipsum dolor est"},
            { name: "Pepe Constant", message: "lorem ipsum dolor estlorem ipsum dolor estlorem ipsum dolor estlorem ipsum dolor est"},
        ],
    },
  ];

    
  try {
    //insert recipes
    const insertManyRecipes = await collectionRecipes.insertMany(recipes);
    console.log(`${insertManyRecipes.insertedCount} documents successfully inserted.\n`);
  } catch (err) {
    console.error(`Something went wrong trying to insert the new documents: ${err}\n`);
  }

}

run().catch(console.dir);
