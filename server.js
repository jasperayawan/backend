const express = require('express');
const bodyParser = require('body-parser');
const ParseServer = require('parse-server').ParseServer;
const ParseDashboard = require('parse-dashboard');
const cors = require('cors');
const dotenv = require('dotenv')
const app = express();


app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());

dotenv.config();

const port = process.env.PORT


// Initialize Parse Serve

const api = new ParseServer({
    databaseURI: "mongodb+srv://emlend:Hanoi123@emlend.zrknnqr.mongodb.net/",
    appId: "123",
    masterKey: "1234",
    serverURL: "http://localhost:1337/parse",
})

const dashboardConfig = new ParseDashboard({
    apps: [
        {
            appId: "123",
            masterKey: "1234",
            serverURL: "http://localhost:1337/parse",
            appName: "emlend"
        }
    ]
});

api.start()

app.use('/parse', api.app)
app.use('/dashboard', dashboardConfig)

// Handle Login request
app.post('/login', async (req,res) => {
    const { identifier, password } = req.body;
    try{    
        const user = await Parse.User.logIn(identifier, password);

        res.json(user);
    }
    catch(err){
        res.status(400).json({ error: err.message })
    }
})

app.post('/register', async (req,res) => {
    const { email, username, password } = req.body;
    const user = new Parse.User();

    user.set("email", email);
    user.set('username', username);
    user.set('password', password);

    try{
        await user.signUp();

        res.json(user);
    }
    catch(err){
        res.status(400).json({ error: err.message });;
    }
})

const Loan = Parse.Object.extend('Loan')

app.post('/loan', async (req,res) => {
    const { barrow_ammount, load_duration, interest_rate, pitch_deck } = req.body;
    const loan = new Loan();

    loan.set("BorrowAmount", barrow_ammount);
    loan.set("LoanDuration", load_duration);
    loan.set("InterestRate", interest_rate);
    loan.set("PitchDeck", pitch_deck);

    try{
        await loan.save();
        res.status(200).json(loan);
    }
    catch(err){
        res.status(400).json(err);
    }
})








app.listen(1337, () => {
    console.log('Server is Listening to http://localhost:1337');

})
