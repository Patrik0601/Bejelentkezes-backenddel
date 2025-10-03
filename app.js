import express from 'express'
import cors from 'cors'
import * as db from './data/db.js'
import bcrypt from 'bcrypt'

const PORT = 3000
const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static("public"))

// összes user
app.get('/users', (req, res) => {
    const users = db.getUsers()
    res.json(users)
});

// user id alapján
app.get('/users/:id', (req, res) => {
    const user = db.getUserById(+req.params.id)
    if(!user){
        return res.status(404).json({ message: "User not found"})
    }
    res.json(user);
});

// regisztráció
app.post('/users', (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).json({ message: "Invalid data" })
    }

    // Megnézzük, hogy van-e már ilyen e-mail az adatbázisban
    const existingUser = db.getUserByEmail(email)
    if (existingUser) {
        return res.status(400).json({ message: "Ezzel az e-mail címmel már regisztráltak!" })
    }

    const salt = bcrypt.genSaltSync()
    const hashedPassword = bcrypt.hashSync(password, salt)

    const saved = db.saveUser(email, hashedPassword)
    const user = db.getUserById(saved.lastInsertRowid)
    res.status(201).json(user)
})

// bejelentkezés
app.post('/login', (req, res) => {
    const {email, password} = req.body
    if(!email || !password){
        return res.status(400).json({message: "Invalid data"})
    }
    const user = db.getUserByEmail(email)
    if(!user){
        return res.status(404).json({ message: "User not found"})
    }
    if(!bcrypt.compareSync(password, user.password)){
        return res.status(403).json({message: "Invalid credentials"})
    }
    res.json(user)
})

app.listen(PORT, () => {
    console.log('Server runs on port ' + PORT)
})
