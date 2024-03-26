import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

console.log(`DB at ${process.env.DB}`);

mongoose.connect(process.env.DB, {})
    .then(() => console.log("Connected to DB"))
    .catch((err) => console.log(err));

mongoose.Promise = global.Promise;

const schema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
    },
});

console.log(mongoose.modelNames());

app.get("/", (_req, res) => res.status(200).json({ message: "API is online" }));

const port = 3001;

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
