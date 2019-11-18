import session from 'express-session';
import express from './config/express';
import passport from './config/passport';

// Use env port or default
const port = process.env.PORT || 5000;

express.use(session({ secret: 'spooky' }));
express.use(passport.initialize());
express.use(passport.session());

// expresss.init();
express.listen(port, () => console.log(`Server now running on port ${port}!`));
