const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("./models/coupoun")
const routes = require('./routes')
const validate = require('./routes/validate')
const cors = require('cors')

const app = express();

app.use(bodyParser.urlencoded({
      extended: false
}));
app.use(cors())
app.use(bodyParser.json());
app.use('/crud', routes)
app.use('/coupon', validate)

const db = "mongodb+srv://akash:@singh1995@cluster0.vqmdr.mongodb.net/test?retryWrites=true&w=majority";

mongoose.Promise = global.Promise;

mongoose
      .connect(db, {
            useNewUrlParser: true
      })
      .then(() => console.log("MongoDB Connected..."))
      .catch(err => console.log(err));

const port = process.env.PORT || 5000;
if(process.env.NODE_ENV==="production"){
      app.use(express.static('client/build'))
      const path = require('path');
      app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
      });
}

app.listen(port, () => console.log(`Server running on port ${port}... 🚀`));