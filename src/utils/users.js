const mongoose=require('mongoose')
const fs=require('fs')
const { StringDecoder } = require("string_decoder")
const users = []
mongoose.connect("mongodb://127.0.0.1:27017/chat_app",{useNewUrlParser:true,userCreateIndex:true,useUnifiedTopology:true})
const Data=mongoose.model("data",{
    username:{
        type:String
    },
    room:{
        type:String
    }
})
const addUser = ({ id, username, room }) => {
    // Clean the data
    username = username.trim()
    room = room.trim()

    // Validate the data
    if (!username || !room) {
        return {
            error: 'Username and room are required!'
        }
    }

    // Check for existing user
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    // Validate username
    if (existingUser) {
        return {
            error: 'Username is in use!'
        }
    }

    // Store user
    const user = { id, username, room  }
 const data=new Data({
     username:username,
     room:room
 })
 data.save().then(()=>{
     console.log(data)
 }).catch((e)=>{
     console.log("error",e)
 })
    users.push(user)
    const dataJSON=JSON.stringify(users)
    fs.writeFileSync("data1.json",dataJSON)
    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)

    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) => {
    return users.find((user) => user.id === id)
}

const getUsersInRoom = (room) => {
    room = room.trim()
    return users.filter((user) => user.room === room)
}
module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}