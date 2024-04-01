import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

mongoose.connect(process.env.DB, {})
    .then(() => console.log("Connected to DB"))
    .catch((err) => console.log(err));

mongoose.Promise = global.Promise;

// mongodb user schema

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email address is required"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    createdAt: {
        type: Date,
        default: new Date(),
    },
});

userSchema.pre("save", async function() {
    this.password = await bcrypt.hash(this.password, 12);
});

const User = mongoose.model("User", userSchema);

const todoSchema = new mongoose.Schema({
    user: {
        type: String,
        required: [true, "User id required"],
    },
    done: {
        type: Boolean,
        default: false,
    },
    content: {
        type: String,
        required: [true, "Todo content required"],
    },
    createdAt: {
        type: Date,
        default: new Date(),
    },
});

const Todo = mongoose.model("Todo", todoSchema);

// Secret token shenanigans

const TOKEN_KEY = "hilipati"; // TODO: Move to .env or smth
const createSecretToken = (id) => jsonwebtoken.sign({ user: id }, TOKEN_KEY, { expiresIn: 3*24*60*60 });

// Signup controller

const Signup = async (req, res) => {
    try {
        const { email, password, createdAt } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) return res.json({message: "User already exists"}); 

        const user = await User.create({ email, password, createdAt });

        const token = createSecretToken(user._id);

        return res
            .cookie("token", token, { withCredentials: true, httpOnly: false, })
            .status(201)
            .json({ message: "User created succesfully", success: true });

    } catch (error) {
        console.log(error);
    }
};

// Login controller

const Login = async (req, res) => {
    try {
        console.log(`Login request received with ${JSON.stringify(req.body)}`);
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: "Email and password required"});

        const user = await User.findOne({email});
        if (!user) return res.status(403).json({ message: "Bad email or password"});

        const auth = await bcrypt.compare(password, user.password);
        if (!auth) return res.status(403).json({ message: "Bad email or password"});

        const token = createSecretToken(user._id);

        return res
            .cookie("token", token, { withCredentials: true, httpOnly: false, })
            .status(201)
            .json({ message: "User logged in successfully", success: true, token, user }); // TODO: Clean up sensitive info

    } catch (error) {
        console.log(error);
    }
};

// Authenticate middleware

const authenticate = async (req, res, next) => {
    console.log("Authenticating user");
    try {
        if (!req.headers.authorization) return res.sendStatus(401);
        const [header, token] = req.headers.authorization.split(" ");
        if (!header || !token) return res.status(401).send("Authentication credentials are required");

        jsonwebtoken.verify(token, TOKEN_KEY, (err, user) => {
            if (err) return res.status(403).send(err); // In reality maybe not expose the error details to the caller :|
            console.log(`User authenticated as ${JSON.stringify(user)}`);
            req.user = user;
            next();
        });

    } catch (error) {
        console.log(error);
        return res.sendStatus(401);
    }
};

// Todo API

const Todos = async (req, res) => {
    try {
        const user = req.user.user;
        console.log(`Received request to fetch ${user} todos from DB`);
        const todos = await Todo.find({ user });
        console.log(`Fetched user ${user} todos from DB, todos: ${JSON.stringify(todos)}`);
        res.json(todos);
    } catch (error) {
        console.log(error);
        res.json({ message: error.message });
    }
};

const CreateTodo = async (req, res) => {
    try {
        const user = req.user.user;
        const { clientRequestId, content } = req.body;
        console.log(`Received create todo request from user ${user} with request id ${clientRequestId} and content '${content}'`);

        const todo = await Todo.create({ user, content });

        console.log(`Added new todo ${JSON.stringify(todo)}`);
        return res.status(201).json({ message: "Todo created successfully", success: true, result: todo._id });
    } catch (error) {
        console.log(error);
        res.json({ message: error.message });
    }
};

const UpdateTodo = async (req, res) => {
    try {
        const todo = req.params.id;
        const { done, content } = req.body;
        if (!todo || (done === undefined) || !content) return res.status(401).json({ message: "Todo ID, done status and content required" });
        console.log(`Received update for todo ${todo} with status: '${done}' and content: '${content}'`);

        const result = await Todo.updateOne({ _id: todo },{ $set: { done, content }});
        return res.status(200).json({ message: "Todo updated successfully", success: true, result });
    } catch (error) {
        console.log(error);
        res.json({ message: error.message });
    }
};

const DeleteTodo = async (req, res) => {
    try {
        console.log(`Received delete for todo ${req.params.id}`);
        const authorizedDelete = await Todo.findOne({ _id: req.params.id, user: req.user.user });
        if (!authorizedDelete) return res.status(403).json({ message: `User ${req.user.user} is not authorized to delete todo ${req.params.id}`});
        const result = await Todo.deleteOne({ _id: req.params.id });
        return res.status(200).json({ message: "Todo deleted successfully", success: true, result });
    } catch (error) {
        console.log(error);
        res.json({ message: error.message });
    }
};

// router

const unauthRoutes = express.Router();
unauthRoutes.post("/signup", Signup);
unauthRoutes.post("/login", Login);

const authRoutes = express.Router();
authRoutes.get("/v1/todos", Todos);
authRoutes.post("/v1/todos", CreateTodo);
authRoutes.put("/v1/todos/:id", UpdateTodo);
authRoutes.delete("/v1/todos/:id", DeleteTodo);

const port = 3001;

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

app.use(function(_req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(cors({
    origin: [`http://127.0.0.1/:${port}`],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
}));

app.use(cookieParser());
app.use(express.json());
app.use(unauthRoutes);
app.use(authenticate);
app.use(authRoutes);
