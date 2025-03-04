const express = require("express");
const jwt = require("jsonwebtoken");
const { UserModel, TodoModel } = require("./db");
const { JWT_SECRET, auth } = require("./auth");


const app = express();
app.use(express.json());


app.post("/signup", async (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    await UserModel.create({
        name,
        email,
        password,
    })
    res.json({
        message: "Signed up successful"
    })

})

app.post("/login", async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const user = await UserModel.findOne({
        email,
        password
    })

    if (user) {
        const token = jwt.sign({
            user: user._id.toString()
        }, JWT_SECRET)

        res.json({
            token
        })
    } else {
        res.status(403).json({
            message: "Incorrect Creds"
        })
    }

})

app.post("/todo", auth, async (req, res) => {
    const title = req.body.title;
    const isDone = req.body.isDone;

    const userId = req.userId;

    if (userId) {
        await TodoModel.create({
            title,
            isDone,
            userId
        })

        res.json({
            message: "todo added",
            userId
        })
    } else {
        res.status(403).json({
            message: "soemthinng went wrong"
        })
    }
})

app.get("/todos", auth, async (req, res) => {
    const userId = req.userId;

    const users = await TodoModel.find({
        userId
    })
    res.json({
        users
    })

})

app.listen(3000, () => {
    console.log("App Running on PORT 3000")
})