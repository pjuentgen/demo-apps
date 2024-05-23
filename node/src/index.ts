import express, { Express } from "express";

const PORT: number = parseInt(process.env.PORT || "8080");
const app: Express = express();

app.get("/", (req, res) => {
  const randomTime = Math.floor(Math.random() * 500);

  setTimeout(() => {
    if (randomTime > 300) {
      res.status(500).send("Error occured");
    } else {
      res.send("Hello World!");
    }
  }, randomTime);
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening for requests on http://localhost:${PORT}`);
});
