const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false
    });
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product(title, price, description, imageUrl, null, req.user._id);
    product.save()
        .then(result => {
            console.log('Product Created');
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.log(err);
        });
};

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then(result => {
            const product = result;
            if (!product) {
                return res.redirect('/');
            }
            res.render('admin/edit-product', {
                pageTitle: 'Edit Product',
                path: '/admin/edit-product',
                editing: editMode,
                product: product
            });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedImageUrl = req.body.imageUrl;
    const updatedPrice = req.body.price;
    const updatedDescription = req.body.description;

    const product = new Product(updatedTitle, updatedPrice, updatedDescription, updatedImageUrl, prodId);
    product.save()
        .then(result => {
            console.log(`${result.modifiedCount} Product Updated !`);
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.log(err);
        })

    // const updatedProduct = {
    //     _id: req.body.productId,
    //     title: req.body.title,
    //     imageUrl: req.body.imageUrl,
    //     price: req.body.price,
    //     description: req.body.description
    // };


    // Product.editProduct(updatedProduct)
    //     .then(result => {
    //         console.log(`${result.modifiedCount} Product Updated`);
    //         res.redirect('/admin/products');
    //     })
    //     .catch(err => {
    //         console.log(err);
    //     });

};

exports.getProducts = (req, res, next) => {
    Product.fetchAll()
        .then(result => {
            res.render('admin/products', {
                prods: result,
                pageTitle: 'Admin Products',
                path: '/admin/products',
            });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;

    Product.deleteProduct(prodId)
        .then(result => {
            console.log(`${result.deletedCount} Product Deleted`);
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.log(err);
        });
};