// Imports environment variabls
require('dotenv').config();

// Imports passport strategy
require('./strategies/google');

const session = require('express-session');

// Imports express, mmongooose, and http
const MongoStore = require('connect-mongo');
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');

const util = require('util');

// Imports socket.io

// Imports middleware
const { urlencoded } = require('express');
const passport = require('passport');
const cors = require('cors');

// Imports deployment necesities
const path = require('path');

// Establishes mongoose
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('connected to db'))
  .catch((err) => console.log(`error connecting to db ${err}`));

// Initiated express
const app = express();

// Server set up
const server = http.createServer(app);

// SocketIO set up
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  },
});

// Registers body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(urlencoded({ extended: false, limit: '10mb' }));

// Registers session middleware
app.use(
  session({
    cookie: {
      maxAge: 3600000 * 24, // one day
    },
    saveUninitialized: false,
    resave: false,
    secret: 'asdlkjewoiuoiuwe',
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
  })
);

// Registers passport auth middleware
app.use(passport.initialize());
app.use(passport.session());

// Registers cors headers
app.use(
  cors({
    origin: ['http://localhost:3000'],
    credentials: true,
  })
);

// Imports router
const routes = require('./routes/index');

app.use('/api', routes);

if (process.env.NODE_ENV === 'production') {
  // Serve production assets
  app.use(express.static('client/build'));

  // Serve index.html from /build for base route (catch all)
  app.get('*', (req, res) => {
    res.sendFile(path.resolve('client', 'build', 'index.html'));
  });
}

const { PORT } = process.env;

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

const STATIC_CHANNELS = [
  {
    name: 'Global chat',
    participants: 0,
    id: 1,
    sockets: [],
  },
  {
    name: 'Funny',
    participants: 0,
    id: 2,
    sockets: [],
  },
];

const NEW_MESSAGE_EVENT = 'new-message-event';

// Todo. Make room be the db id of the connection
// save msg to db on socket event
// Create route to send old messages to front end

io.on('connection', async (socket) => {
  let room;
  // Creates a socket room with the match id of the current matched users
  await socket.on('matchId', async function (matchId) {
    room = matchId;
    socket.join(room);
    console.log(socket);
  });

  socket.on(NEW_MESSAGE_EVENT, (data) => {
    console.log(data);

    io.in(room).emit(NEW_MESSAGE_EVENT, data);
  });

  socket.on('disconnect', () => {
    socket.leave(room);
  });
});

// Pull into own routes files
app.get('/getChannels', (req, res) => {
  res.json({
    channels: STATIC_CHANNELS,
  });
});
/* 

app.get('/', (req, res) => {
  if (req.session.authenticated) {
    // User is authenticated
    res.send({ status: 200, session: req.session, id: req.sessionID });
  } else {
    // User has not been authenticated
    res.send({ status: 200, session: req.session, id: req.sessionID });
  }
}); */
