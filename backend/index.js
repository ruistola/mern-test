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

// secret token shenanigans

const TOKEN_KEY = "hilipati"; // TODO: Move to .env or smth
const createSecretToken = (id) => jsonwebtoken.sign({ user: id }, TOKEN_KEY, { expiresIn: 3*24*60*60 });

// signup controller

const Signup = async (req, res, next) => {
    try {
        const { email, password, createdAt } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) return res.json({message: "User already exists"}); 

        const user = await User.create({ email, password, createdAt });

        const token = createSecretToken(user._id);

        res
            .cookie("token", token, { withCredentials: true, httpOnly: false, })
            .status(201)
            .json({ message: "User created succesfully", success: true, token });

        next();

    } catch (error) {
        console.log(error);
    }
};

// Login controller

const Login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: "Email and password required"});

        const user = await User.findOne({email});
        if (!user) return res.status(403).json({ message: "Bad email or password"});

        const auth = await bcrypt.compare(password, user.password);
        if (!auth) return res.status(403).json({ message: "Bad email or password"});

        const token = createSecretToken(user._id);

        res
            .cookie("token", token, { withCredentials: true, httpOnly: false, })
            .status(201)
            .json({ message: "User logged in successfully", success: true, token });

        next();

    } catch (error) {
        console.log(error);
    }
};

// Authenticate middleware

const authenticate = async (req, res, next) => {
    try {
        if (!req.headers.authorization) return res.sendStatus(401);
        const [header, token] = req.headers.authorization.split(" ");
        if (!header || !token) return res.status(401).send("Authentication credentials are required");

        jsonwebtoken.verify(token, TOKEN_KEY, (err, user) => {
            if (err) return res.status(403).send(err); // In reality maybe not expose the error details to the caller :|
            req.user = user; // Just testing: Authenticated routes can expect the request to contain a field "user"
            next();
        });

    } catch (error) {
        console.log(error);
        return res.sendStatus(401);
    }
};

// Authenticated route test

const UserHome = async (req, res, next) => {
    try {
        if (!req.user) return res.status(403).json({ message: "User is unauthenticated" });
        res.status(200).json({ status: true, user: req.user }); // The user field is not part of the original request but padded by authenticate()
        next();
    } catch (error) {
        console.log(error);
    }
};

// router

const unauthRoutes = express.Router();
unauthRoutes.post("/signup", Signup);
unauthRoutes.post("/login", Login);

const authRoutes = express.Router();
authRoutes.post("/home", UserHome);

const port = 3001;

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

app.use(cors({
    origin: [`http://127.0.0.1/:${port}`],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));

app.use(cookieParser());
app.use(express.json());
app.use(unauthRoutes);
app.use(authenticate);
app.use(authRoutes);
