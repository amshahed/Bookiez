'use strict';

var express = require('express');
var dotenv = require('dotenv');
var fs = require('fs');
var bp = require('body-parser');
var bcrypt = require('bcrypt');
var goo = require('google-books-search');
var mongo = require('mongodb').MongoClient;
var bin = require('mongodb').Binary;
var app = express();

//load .env file, creating port
dotenv.config({verbose:true});
var port = process.env.PORT || 8080;

//listen to port
app.listen(port, function () {
  console.log('listening on port '+port);
});

app.use(express.static('public'));
app.use(bp.urlencoded({ extended: false }));

//render hoome page
app.get('/', function(req, res){
	res.sendFile(process.cwd() + '/views/index.html');
});

//render sign up page
app.get('/signup', function(req, res){
	res.sendFile(process.cwd() + '/views/signup.html');
});

//render log in page
app.get('/login', function(req, res){
	res.sendFile(process.cwd() + '/views/signin.html');
});

//show all books
app.get('/books', function(req, res){
	res.sendFile(process.cwd() + '/views/books.html');
});

//show my books
app.get('/mybooks', function(req, res){
    res.sendFile(process.cwd() + '/views/mybooks.html');
});

//show my books
app.get('/myreq', function(req, res){
    res.sendFile(process.cwd() + '/views/myreq.html');
});

//show my books
app.get('/reqtome', function(req, res){
    res.sendFile(process.cwd() + '/views/reqtome.html');
});

//show my books
app.get('/borrows', function(req, res){
    res.sendFile(process.cwd() + '/views/borrows.html');
});


//signup new user
app.post('/su', function(req, res){
	var first = req.body.first;
	var last = req.body.last;
	var name = first+' '+last;
	var email = req.body.email;
	var pass = req.body.pass;

    //hash password before saving
	bcrypt.hash(pass, 5, function (err, hash){
    	if (err)	res.send({error : 'nohash'});
        else {
            pass = hash;
            mongo.connect('mongodb://jesus_christ:jesuschrist@ds249727.mlab.com:49727/dabba', function(err, db){
                if (err)    res.send({error: err});
                else {
                    var c = db.collection('bookies');

                    //see if email exists, if does, can't sign up
                    c.find({_id:email},{}).toArray(function(er, doc){
                        if (er) res.send({error : er});
                        else {
                            if (doc.length!=0)
                                res.send({error : 'ase'});
                            else {
                                var obj = { _id:email, name:name, password:pass, to:[], from:[] };
                                
                                //if doesn't exist, save in db
                                c.insert(obj, function(e, docu){
                                    if (e)  res.send({error : e});
                                    else res.send({ name:name, to : [], from : [], lent : [], borrowed : [] });
                                });
                            }
                        }
                    });
                }
            });
        }
  	});
});

//existing user's login
app.post('/li', function(req, res){
    var email = req.body.email;
    var pass = req.body.pass;
    mongo.connect('mongodb://jesus_christ:jesuschrist@ds249727.mlab.com:49727/dabba', function(err, db){
        if (err)    res.send({error: err});
        else {
            var c = db.collection('bookies');

            //see if email exists in db, if not no user
            c.find({_id:email},{}).toArray(function(er, doc){
                if (er) res.send({error:er});
                else {
                    if (doc.length==0)  res.send({error:'nouser'});
                    else {

                        //compare given password with saved password
                        bcrypt.compare(pass, doc[0].password, function(e, ress){
                            if (e)  res.send({error:e});
                            else if (ress==false) res.send({error:'wrongpass'});
                            else if (ress==true) {
                                res.send({ name : doc[0].name, to : doc[0].to, from : doc[0].from, lent : doc[0].lent, borrowed : doc[0].borrowed });
                            }
                        });
                    }
                }
            });
        }
    });
});

app.post('/getbooks', function(req, res){
   mongo.connect('mongodb://jesus_christ:jesuschrist@ds249727.mlab.com:49727/dabba', function(err, db){
        if (err)    res.send({error: err});
        else {
            var c = db.collection('books');
            c.find({}, {_id:false}).toArray(function(er, doc){
                if (er) res.send({error: er});
                else res.send(doc);
            });
        }
    });
});

app.post('/getmybooks', function(req, res){
    var email = req.body.email;
   mongo.connect('mongodb://jesus_christ:jesuschrist@ds249727.mlab.com:49727/dabba', function(err, db){
        if (err)    res.send({error: err});
        else {
            var c = db.collection('books');
            c.find({owner:email}, {_id:false}).toArray(function(er, doc){
                if (er) res.send({error: er});
                else res.send(doc);
            });
        }
    });
});

app.post('/getbook', function(req, res){
    var book = req.body.book;
    var arr = [];
    goo.search(book, function(err, books){
        if (err)    res.send({error:err});
        else {
            for (var i=0; i<books.length; i++)
                arr.push([books[i].id, books[i].title, books[i].thumbnail, books[i].authors]);
            res.send(arr);
        }
    });
});

app.post('/addbook', function(req, res){
    var email = req.body.email;
    var id = req.body.id;
    var title = req.body.title;
    var image = req.body.image;
    mongo.connect('mongodb://jesus_christ:jesuschrist@ds249727.mlab.com:49727/dabba', function(err, db){
        if (err)    res.send({error: err});
        else {
            var c = db.collection('books');
            c.find({book_id:id, owner:email},{}).toArray(function(er, doc){
                if (er) res.send({error : er});
                else if (doc.length!=0)  res.send({error : 'ase'});
                else {
                    c.insert({ book_id:id, title:title, owner:email, image:image, accepted:'none' }, function(e, d){
                        if (e)  res.send({error: e});
                        else res.send({book:'added'});
                    });
                }
            });
        }
    });
});

app.post('/removebook', function(req, res){
    var email = req.body.email;
    var id = req.body.id;
    mongo.connect('mongodb://jesus_christ:jesuschrist@ds249727.mlab.com:49727/dabba', function(err, db){
        if (err)    res.send({error: err});
        else {
            var c = db.collection('books');
            c.remove({book_id:id, owner:email}, function(er, doc){
                if (er) res.send({error:er});
                else {
                    res.send({book:'removed'});
                }
            });
        }
    });
});

app.post('/requestbook', function(req, res){
    var email = req.body.email;
    var id = req.body.id;
    var owner = req.body.owner;
    var img = req.body.img;
    mongo.connect('mongodb://jesus_christ:jesuschrist@ds249727.mlab.com:49727/dabba', function(err, db){
        if (err)    res.send({error: err});
        else {
            var c = db.collection('bookies');
            c.update({_id:owner}, { $push : { from : { id:id, chaise:email, image:img } } }, function(er, doc){
                if (er) res.send({error : er});
                else {
                    c.update({_id:email}, { $push : { to : { id:id, owner:owner, image:img } } }, function(e, docu){
                        if (e)  res.send({error: e});
                        else res.send({book: 'requested'});
                    });
                }
            });
        }
    });
});

app.post('/acceptreq', function(req, res){
    var id = req.body.id;
    var owner = req.body.owner;
    var img = req.body.img;
    var email = req.body.email;
    mongo.connect('mongodb://jesus_christ:jesuschrist@ds249727.mlab.com:49727/dabba', function(err, db){
        if (err)    res.send({error: err});
        else {
            var c = db.collection('bookies');
            c.update({_id: owner}, { $push: { lent: { id: id,  img: img, email: email} }, $pull : { from : { id:id, chaise:email, image:img } } }, function(er, docu){
                if (er) res.send({error: er});
                else {
                    c.update({_id:email}, { $push: { borrowed: { id:id, img:img, owner:owner } }, $pull : { to : { id:id, owner:owner, image:img } } }, function(er, docu){
                        if (er) res.send({error: er});
                        else {
                            var b = db.collection('books');
                            b.update({book_id:id, owner: owner}, { $set: { accepted: email } }, function(er, doc){
                                if (er) res.send({error: er});
                                else res.send({updated: true});
                            });
                        }
                    });
                }
            });
        }
    });
});

app.post('/rejectreq', function(req, res){
    var id = req.body.id;
    var owner = req.body.owner;
    var img = req.body.img;
    var email = req.body.email;
    mongo.connect('mongodb://jesus_christ:jesuschrist@ds249727.mlab.com:49727/dabba', function(err, db){
        if (err)    res.send({error: err});
        else {
            var c = db.collection('bookies');
            c.update({_id:owner},{ $pull : { from : { id:id, chaise:email, image:img } } }, function(er, doc){
                if (er) res.send({error: er});
                else {
                    c.update({_id:email}, { $pull : { to : { id:id, owner:owner, image:img } } }, function(e, docu){
                        if (e) res.send({error : e});
                        else res.send({request : 'rejected'});
                    });
                }
            });
        }
    });
});

app.post('/cancelreq', function(req, res){
    var id = req.body.id;
    var owner = req.body.owner;
    var img = req.body.img;
    var email = req.body.email;
    mongo.connect('mongodb://jesus_christ:jesuschrist@ds249727.mlab.com:49727/dabba', function(err, db){
        if (err)    res.send({error: err});
        else {
            var c = db.collection('bookies');
            c.update({_id:owner},{ $pull : { from : { id:id, chaise:email, image:img } } }, function(er, doc){
                if (er) res.send({error: er});
                else {
                    c.update({_id:email}, { $pull : { to : { id:id, owner:owner, image:img } } }, function(e, docu){
                        if (e) res.send({error : e});
                        else res.send({cancelled: true});
                    });
                }
            });
        }
    });
});

app.post('/returnbook', function(req, res){
    var id = req.body.id;
    var owner = req.body.owner;
    var img = req.body.img;
    var email = req.body.email;
    mongo.connect('mongodb://jesus_christ:jesuschrist@ds249727.mlab.com:49727/dabba', function(err, db){
        if (err)    res.send({error: err});
        else {
            var c = db.collection('bookies');
            c.update({_id:owner},{ $pull : { lent : { id, img, email } } }, function(er, doc){
                if (er) res.send({error: er});
                else {
                    c.update({_id:email}, { $pull : { borrowed : { id, img, owner } } }, function(e, docu){
                        if (e) res.send({error : e});
                        else {
                            var b = db.collection('books');
                            b.update({book_id: id, owner: owner}, { $set: { accepted: 'none' } }, function(er, doc){
                                if (er) res.send({error: er});
                                else res.send({returned: true});
                            })
                        }
                    });
                }
            });
        }
    });
});