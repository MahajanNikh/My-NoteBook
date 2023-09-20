const connectToMongo = require("./db");
var cors = require('cors')

connectToMongo();
const express = require("express");
const app = express();

 
app.use(cors())
const port = 5000;

app.use(express.json());


app.use('/api/auth',require('./routes/auth'))
app.use('/api/notes',require('./routes/notes'))

// app.get("/", (req, res) => {
//   res.send("Hello Nikhil! I am good how are u?");
// });

app.listen(port, () => {
  console.log(`MyNotebook beckend listening on port http://localhost:${port}`);
});
