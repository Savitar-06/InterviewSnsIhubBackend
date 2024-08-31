const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../modal/user');
const userroles = require('../modal/userroles');

const router = express.Router();

router.post('/signup', async (req, res) => {
  const { firstName, lastName, email, mobile, role, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ firstName, lastName, email, mobile, role, password: hashedPassword });
    await newUser.save();
    res.json({ 
        statuscode:201,
        error:false,
        response:{
            message:"User registered successfully",
        }
    });
  } catch (error) {
    res.json({ 
        statuscode:400,
        error:true,
        response:{
            message:"Error registering user",
        }
    });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ userId: user._id }, 'secretkey');
      res.json({ 
        statuscode:200,
        error:false,
        response:{
            message:"Login Successful",
            token:token
        }
      });
    } else {
        res.json({ 
            statuscode:400,
            error:true,
            response:{
                message:"Invalid credentials",
            }
        });
    }
  } catch (error) {
    res.json({ 
        statuscode:400,
        error:true,
        response:{
            message:"Error logging in",
        }
    });
  }
});

router.get('/users', async (req, res) => {
  try {

    const users = await User.find();

    const userWithRoles = await Promise.all(users.map(async (user) => {
      const role = await userroles.findOne({ id: user.role });
      console.log(role)
      return {
        ...user.toObject(),
        role: role ? { id: role?.toObject().id,type: role?.toObject().type,value: role?.toObject().value } : null
      };
    }));

    res.json(userWithRoles);

  } catch (error) {
    res.status(400).json({ error: 'Error fetching users' });
  }
});

router.get('/usersroles', async (req, res) => {
    try {
      const roles = await userroles.find();
      res.json(roles);
    } catch (error) {
      res.status(400).json({ error: 'Error fetching users' });
    }
  });

module.exports = router;
