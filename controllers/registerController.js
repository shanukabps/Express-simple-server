const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) { this.users = data }
}

const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt')

const handleNewUser = async (req, res) => {
    const { user, pwd } = req.body;
    console.log('first', user, pwd)
    if (!user || !pwd) return res.status(400).json({
        'message': 'username and pw required'
    })
    // check  duplicate
    const duplicate = usersDB.users.find(person => person.username === user)
    if (duplicate) {
        return res.sendStatus(409)
    }
    try {
        const hashedPw = await bcrypt.hash(pwd, 10)
        //strore
        let newUser = {
            "username": user,
            "password": hashedPw
        }
        usersDB.setUsers([...usersDB.users, newUser])
        await fsPromises.writeFile(
            path.join(__dirname, '..', 'model', 'users.json'),
            JSON.stringify(usersDB.users)
        )
        res.status(201).json({ 'sucess': `New user  ${user}` })
    } catch (err) {
        console.log('err', err)
        res.status(500).json({ 'message': err.message })
    }
}


module.exports = { handleNewUser }
