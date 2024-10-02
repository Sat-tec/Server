const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');
const hashPassword = require('../utils/hashPassword');

// Sign Up
exports.signup = async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await hashPassword(password);

  const newUser = new User({ username, email, password: hashedPassword });

  User.create(newUser, (err, data) => {
    // Generate token for the new user
    const token = jwt.sign({ id: data._id }, config.secret, { expiresIn: config.jwtExpiration });

    // Send response with token
    res.status(201).send({ message: 'User was registered successfully!', accessToken: token });
  });
};

// Sign In
exports.signin = (req, res) => {
  User.findByEmail(req.body.email, (err, user) => {
    if (err) return res.status(500).send({ message: err.message });
    if (!user) return res.status(404).send({ message: 'Some thing went wrong.' });

    const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) return res.status(401).send({ accessToken: null, message: 'Invalid Credentials!' });

    const token = jwt.sign({ id: user.id }, config.secret, { expiresIn: config.jwtExpiration });
    res.status(200).send({ id: user.id, username: user.username, email: user.email, accessToken: token });
  });
};


// Sign out (optional)
exports.signout = (req, res) => {
    // This can just be an acknowledgment that the user has signed out
    res.status(200).send({ message: 'User signed out successfully!' });
}


