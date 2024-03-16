const express = require('express')
const app = express();
const path = require('path');
const cors = require('cors')
const { logEvents, logger } = require('./logEvents');
const { error } = require('console');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credintials');
const PORT = process.env.PORT || 3000;

// app.use((req,res,next)=>{
//     console.log(req.method,' ', req.path, ' ',)
//     logEvents(`message ${req.method}  ${req.headers.origin}\t ${req.url}\t`, 'reqLog.txt')
//     next()
// })

//cors cross origin resourse share
// const whitelist = ['https://www.google.com', 'http://127.0.0.1:3000']
// const coresOptions = {
//     origin: (origin, callback) => {
//         if (whitelist.indexOf(origin) !== -1 || !origin) {
//             callback(null, true)
//         } else {
//             callback(new Error('now allow by aloowed  by CORS'))
//         }
//     },
//     optionsSucessStatus: 200
// }

// custom middleware logger
app.use(logger);

// Cross Origin Resource Sharing
// app.use(cors(coresOptions))
app.use(credentials)

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json 
app.use(express.json());

app.use(cookieParser())

// routes
app.use('/', require('./routes/root'));
app.use('/register', require('./routes/register'))
app.use('/auth', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'))
app.use('/logout', require('./routes/logout'));
app.use(verifyJWT)
app.use('/employees', require('./routes/api/employees'));

app.use(function (err, req, res, next) {
    console.log('error', err.stack)
    res.status(500).send(err.message)
})

app.listen(PORT, () => console.log('Server is running on PORT ', PORT))