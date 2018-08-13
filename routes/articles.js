var express = require('express');
var router = express.Router();

//Article Model
var Article = require('../model/article');

//User Model
var User = require('../model/user');


    router.get('/add', ensureAuthenticated,  function(req, res) {
        res.render('add_article', {
            title: 'Add Article'
        });
    });
    
    router.post('/add',  function(req, res){
            req.checkBody('title', 'Title is required').notEmpty();
//req.checkBody('author', 'Author is required').notEmpty();
            req.checkBody('body', 'Body is required').notEmpty();
    
            //Get Errors
            let errors = req.validationErrors();
    
            if(errors){
                res.render('add_articles', {
                    errors:errors
                });
            } else{
                var article = new Article();
                article.title = req.body.title;
                article.author = req.user._id;
                article.body = req.body.body;
    
    
                article.save(function(err){
                    if(err){
                        console.log(err);
                        return;
                    } else {
                        req.flash('success', 'Article Added!!');
                        res.redirect('/');
                    }
                });
                        }
    
                });
    
                //Load edit form
    router.get('/edit/:id', ensureAuthenticated, function(req, res){
        Article.findById(req.params.id, function(err, article){
            if(article.author != req.user._id){
                req.flash('danger', 'Not Authorized');
                res.redirect('/');
            }
            res.render('edit_article', {
                title: 'Edit Article',
                article: article
            });
        });
        });
    
    //Update Submit
        router.post('/edit/:id', function(req, res){
            
    
            var article = {};
            article.title = req.body.title;
            article.author = req.body.author;
            article.body = req.body.body;
            
            var query = {_id:req.params.id}
            
            Article.update(query, article, function(err){
                if(err){
                    console.log(err);
                    return;
                } else {
                    req.flash('success', 'Article Updated!!');
                    res.redirect('/');
                }
            });
            });
    
        router.delete('/:id', function(req, res){
            if(!req.user._id){
                res.status(500).send();
            }
            
            var query = {_id: req.params.id}

            Article.findById(req.params._id, function(err, article){
                if(article.author != req.user._id){
                    res.status(500).send();
                }else {
                    Article.remove(query, function(err){
                        if(err){
                            console.log(err);
                        }
                            res.send("Success");
                    });
                }
            });
            
        });

    //Get Single Article
router.get('/:id', function(req, res){
    Article.findById(req.params.id, function(err, article){
        User.findById(article.author, function(err, user){
            res.render('article', {
                article: article,
                author: user.name
            });
        });
        
    });
    });

    //Access Control
    function ensureAuthenticated(req, res, next){
        if(req.isAuthenticated()){
            return next();
        } else {
            req.flash('danger', 'Please login');
            res.redirect('/users/login');
        }
    }

    module.exports = router;
    