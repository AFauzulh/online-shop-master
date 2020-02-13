const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

class Product {
    constructor(title, price, description, imageUrl, id, userId) {
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
        this._id = id ? new mongodb.ObjectID(id) : null;
        this.userId = new mongodb.ObjectID(userId);
    }

    save() {
        const db = getDb();
        let dbOp;

        if (this._id) {
            dbOp = db.collection('products')
                .updateOne({
                    _id: this._id
                }, {
                    $set: this
                });
        } else {
            dbOp = db.collection('products').insertOne(this);
        }
        return dbOp
            .then(result => {
                return result;
            })
            .catch(err => {
                console.log(err);
            });
    }

    static fetchAll() {
        const db = getDb();
        return db.collection('products')
            .find()
            .toArray()
            .then(products => {
                return products;
            })
            .catch(err => {
                console.log(err);
            });
    }

    static findById(prodId) {
        const db = getDb();
        return db.collection('products')
            .find({
                _id: new mongodb.ObjectID(prodId)
            })
            .next()
            .then(product => {
                return product;
            })
            .catch(err => {
                console.log(err);
            });
    }

    static deleteProduct(prodId) {
        const db = getDb();

        return db.collection('products')
            .deleteOne({
                _id: new mongodb.ObjectID(prodId)
            })
            .then(result => {
                return result;
            })
            .catch(err => {
                console.log(err);
            });
    }

    // static editProduct(updatedProduct) {
    //     const db = getDb();

    //     const newValues = {
    //         $set: {
    //             title: updatedProduct.title,
    //             price: updatedProduct.price,
    //             description: updatedProduct.description,
    //             imageUrl: updatedProduct.imageUrl
    //         }
    //     };

    //     return db.collection('products')
    //         .updateOne({
    //             _id: new mongodb.ObjectID(updatedProduct._id)
    //         }, newValues)
    //         .then(result => {
    //             return result;
    //         })
    //         .catch(err => {
    //             console.log(err);
    //         });
    // }
}
module.exports = Product;