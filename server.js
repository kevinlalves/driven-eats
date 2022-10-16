import express from "express";
const app = express();
app.disable("x-powered-by");

const port = 8000;

app.use(express.static("."));

app.get("/", (req, res) => {
  res.send("index");
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
