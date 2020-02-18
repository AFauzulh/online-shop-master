const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');

const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findById('5e4553e7b24d22296ca17820')
        .then(user => {
            req.user = user
            next();
        })
        .catch(err => {
            console.log(err);
        });
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

let url = 'mongodb+srv://firss:GmzEQpUk29FxCysi@cluster0-frrnr.mongodb.net/shop?retryWrites=true&w=majority';

mongoose.connect(url)
    .then(result => {
        User.findOne()
            .then(user => {
                if (!user) {
                    const user = new User({
                        name: 'Alfirsa',
                        email: 'alfirss@gmail.com',
                        cart: {
                            items: []
                        }
                    });
                    user.save();
                }
            });
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });