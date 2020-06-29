/****************************************
***************Dépendances***************
****************************************/

// Serveur http
const express = require('express');
const app = express();
// Sessions
const session = require('express-session');
const cookieParser = require('cookie-parser');
// Base de données
const uri = "mongodb+srv://maxime:Mh9Sx5w2zx04acHu@maximeperon-ilsqk.mongodb.net/";
const MongoClient = require('mongodb').MongoClient(uri, { useNewUrlParser: true });
const MongoStore = require('connect-mongo')(session);
// Outils
const path = require('path');
const bodyParser = require('body-parser');
const sha1 = require('sha1');
const { v1: uuidv1 } = require('uuid');
const nodemailer = require('nodemailer');
require('dotenv').config();

const port = process.env.PORT || 5000;

/****************************************************
 ********************Serveur Http********************
 ***************************************************/

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', express.static(path.join(__dirname, '/dist')));

app.use(cookieParser());

app.use(session({
  store: new MongoStore({
    url: uri+'reseausocial'
  }),
  secret:'123456789SECRET',
  saveUninitialized : false,
  resave: false
}));

// Nodemailer
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.USER,
    pass: process.env.PASSWORD
  }
});



// Functions

const stateBdd = {
  client: null
}

const connectBdd = function(bdd, col, done){

  if(stateBdd.client){
    const db = stateBdd.client.db(bdd);
    const collection = db.collection(col);
    done(collection);
  }

  MongoClient.connect(function(err, client){
    if(err){
      console.log('Erreur de connexion à la base de données');
    }
    else{
      stateBdd.client = client;
      const db = client.db(bdd);
      const collection = db.collection(col);
      done(collection);
    }
  })
}

const closeBdd = function(){
  if(stateBdd.client){
    stateBdd.client.close(function(){
      stateBdd.client = null;
      console.log('bdd fermée')
    });
  }
 
}

// Routing

// Inscription
app.post('/register', function(req, res){

  let token = uuidv1();
  let uuid = uuidv1();

  const connectBddPromise = new Promise(function(resolve, reject) {
    connectBdd('reseausocial', 'users', function(value){
      resolve(value);
    })
  })
  connectBddPromise.then(function(users){
    users.insertOne({
      pseudo: req.body.pseudo,
      pwd: sha1(req.body.pwd),
      email: req.body.email,
      isAdmin: false,
      verified: false,
      token,
      uuid,
    })

    let mailOptions = {
      from: 'noreplymaximeperon@gmail.com',
      to: req.body.email,
      subject: 'Activation de votre compte',
      text: `
        Bonjour ${req.body.pseudo},

        Merci de vous être inscris sur mon réseau social.

        Pour activer votre compte, veuillez cliquer sur le lien suivant :

        https://reseausocialmaxime.herokuapp.com/check/${token}

        Cordialement,

        Maxime Péron
      `
    }

    transporter.sendMail(mailOptions, function(err, data){
      if(err){
        console.log(err);
      }
    })
  })
  
});

// Vérification du token
app.get('/check/:token', function(req, res){
  const connectBddPromise = new Promise(function(resolve, reject) {
    connectBdd('reseausocial', 'users', function(value){
      resolve(value);
    })
  })

  connectBddPromise.then(function(users){
    users.find({token: req.params.token}).toArray(function(err,data){
      if(err){
        console.log(err);
      }
      else{
        if(data.length){
          users.updateOne({token: req.params.token}, {$set: {verified: true, token: null}});
          res.sendFile(path.join(__dirname, '/dist/index.html'));
        }
        else{
          console.log('Erreur token');
        }
      }
    })
  })
})

// Connexion

app.post('/connect', function(req, res){

  const connectBddPromise = new Promise(function(resolve, reject) {
    connectBdd('reseausocial', 'users', function(value){
      resolve(value);
    })
  })
  connectBddPromise.then(function(users){
    users.find({
      pseudo: req.body.pseudo,
      pwd: sha1(req.body.pwd),
      verified: true
    }).toArray(function(err,data){
      if(err){
        console.log('Erreur lors de l\'authentification');
      }
      else{
        if(data.length){
          // Création de la session
          req.session.pseudo = data[0].pseudo;
          req.session.uuid = data[0].uuid;

          

          // On indique que le client est connecté
          users.updateOne({pseudo: req.body.pseudo}, {$set: {connected: true}});
          res.sendFile(path.join(__dirname, '/dist/index.html'));
        }
      }
    })
  })
})

app.all('*', function(req, res){
  res.sendFile(path.join(__dirname, '/dist/index.html'));
});

// Serveur
const HttpServer = app.listen(port, () => console.log('Serveur démarré sur le port '+port));

/***************************************************
 *****************Serveur websocket*****************
 **************************************************/

const socketIo = require('socket.io');

const webSocketServer = socketIo(HttpServer);

webSocketServer.on('connect', function(socket){

  socket.on('sendPseudo', function(data){

    const connectBddPromise = new Promise(function(resolve, reject) {
      connectBdd('reseausocial', 'users', function(value){
        resolve(value);
      })
    })
    connectBddPromise.then(function(users){
      users.find({pseudo: data.pseudo}).toArray(function(err, data){
        socket.emit('sendInfoUtil', {
          isAdmin: data[0].isAdmin,
          uuid: data[0].uuid
        })
      })
    })
    
  })


  socket.on('demandeListeConnecte', function(data){
    const connectBddPromise = new Promise(function(resolve, reject) {
      connectBdd('reseausocial', 'users', function(value){
        resolve(value);
      })
    })
    connectBddPromise.then(function(users){
      users.find({connected: true}).toArray(function(err, data){
        socket.emit('sendListeConnecte', {
          listeConnecte: data
        })
      })
    })
  })

  socket.on('sendUuid', function(data){

    const connectBddPromise = new Promise(function(resolve, reject) {
      connectBdd('reseausocial', 'users', function(value){
        resolve(value);
      })
    })
    connectBddPromise.then(function(users){
      users.find({uuid: data.uuid}).toArray(function(err, data){
        socket.emit('sendProfilUser', {
          user: data
        })
      })
    })
    
  })

  socket.on('sendUuidDeco', function(data){
    socket.uuid = data.uuid;
  })

  socket.on('disconnect', function(reason){

    console.log('coucou');

    const connectBddPromise = new Promise(function(resolve, reject) {
      connectBdd('reseausocial', 'users', function(value){
        resolve(value);
      })
    })
    connectBddPromise.then(function(users){
      users.updateOne(
        {uuid: socket.uuid},
        {$set: {connected: false}}
      )
    })

  })

})