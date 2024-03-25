import express from "express";
import cors from "cors";

const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (_req, res) => res.status(200).json({ message: "API is online" }));

const port = 3001;

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
