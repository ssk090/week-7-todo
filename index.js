const express = require("express");
const jwt = require("jsonwebtoken");
const { UserModel, TodoModel } = require("./db");
const { JWT_SECRET, auth } = require("./auth");
const bcrypt = require('bcrypt')
const { z } = require('zod');

const app = express();
app.use(express.json());

app.post("/signup", async (req, res) => {
    const requiredBody = z.object({
        email: z.string().email(),
        name: z.string().min(3).max(16),
        password: z.string().min(3).max(10)
    })

    const parsedData = requiredBody.safeParse(req.body)

    if (!parsedData.success) {
        res.status(403).json({
            message: "Incorrect format",
            error: parsedData.error
        })
        return
    }

    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    const hashedPassword = await bcrypt.hash(password, 5);
    try {
        await UserModel.create({
            name,
            email,
            password: hashedPassword,
        });
        res.status(200).json({
            message: "Signed up successful"
        });
    } catch (error) {
        res.status(403).json({
            message: "duplicated email"
        });
    }
})

app.post("/login", async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const user = await UserModel.findOne({
        email,
    })

    const passwordMatched = await bcrypt.compare(password, user.password)

    if (passwordMatched) {
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