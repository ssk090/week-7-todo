const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const ObjectId = mongoose.ObjectId;

mongoose.connect("mongodb+srv://shivanandasai38:3dYtmy9Vx3dlObQf@mongo-class.vr2ag.mongodb.net/todo-db-from-code")

const User = new Schema({
    name: String,
    email: { type: String, unique: true },
    password: String
})

const Todo = new Schema({
    title: String,
    isDone: Boolean,
    userId: ObjectId
})

const UserModel = model('users', User);
const TodoModel = model('todos', Todo);

module.exports = {
    UserModel,
    TodoModel
}