const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', 
        {pageTitle: 'Add Product', 
        path: '/admin/add-product',
        editing: false});
}

exports.getProducts = (req, res, next) => {
    Product.fetchAll()
    .then(products=> {
        res.render('admin/products', {prods: products, pageTitle: 'Admin Products', path: '/admin/products'});
    })
    .catch(err => console.log(err));
}

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if(!editMode) {
        return res.redirect('/');
    }
    const prodId = req.params.productId;
    Product.findById(prodId)
    .then(product => {
        if(!product) return res.redirect('/');

        res.render('admin/edit-product', {
            pageTitle: 'Edit Product', 
            path: '/admin/edit-product',
            editing: editMode,
            product: product
        });
    })
    .catch(err => console.log(err));
}

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const desc = req.body.description;
    
    Product.updateProduct(prodId, title, imageUrl, price, desc)
    .then(result => {
        res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
}

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.deleteProduct(prodId)
    .then(result => {
        res.redirect('/admin/products');
    })
    .catch(err => console.log(err));

}

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const price = req.body.price;
    const userId = req.user._id;
    const product = new Product(title, price, description, imageUrl, userId);
    product.save()
    .then(result => {
        console.log('Created Product');
        res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
}
