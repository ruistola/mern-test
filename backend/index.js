import express, { json } from "express";

const app = express();

app.use(express.json());

app.get("/", (_req, res) => res.status(200).json({ message: "API is online" }));

const port = 3001;

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
