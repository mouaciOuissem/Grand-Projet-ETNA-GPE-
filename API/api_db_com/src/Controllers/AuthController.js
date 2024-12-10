const axios = require('axios');
const { sequelize } = require('../Models');
const { User, UserDetails, UserFiscalDetails, SocialCategorie, Bucket } = require('../Models');
const helpers = require('../helpers/utils');
const dataUrl = process.env.SNL_URL_DATA;
const dataPort = process.env.SNL_PORT_DATA;
const env = process.env.NODE_ENV;

class AuthController {
  async login(req, res, next) {
    try {
      const { email, username } = req.body;
      
      if (!email && !username) {
        return res.status(400).json({ error: 'Email or username is required' });
      }

      const query = email ? { email } : { username };
      const user = await User.findOne({ where: query });
      
      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json({ message: 'User found', user });

    } catch (error) {
        if (error.name === 'SequelizeDatabaseError') {
            res.status(500).json({ error: 'Database error occurred' });
        } else if (error.name === 'SequelizeConnectionError') {
            res.status(500).json({ error: 'Database connection error' });
        } else {
            res.status(500).json({ error: 'ERROR : Login user' });
        }
    }
  }; 

  async register(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const { username, email, password } = req.body;
  
      if (!email || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
      }

      const newUser = await User.create({ username, email, password }, { transaction });
      const newUserDetails = await UserDetails.create({ "UserId": newUser.id }, { transaction });
      const randomString = helpers.generateRandomString(30);
      await Bucket.create({ "UserdetailsId": newUserDetails.id, "bucketName": randomString }, { transaction });
      await UserFiscalDetails.create({ "UserdetailsId": newUserDetails.id }, { transaction });
      await SocialCategorie.create({ "UserdetailsId": newUserDetails.id }, { transaction });
      if(env != "development") {
        const createBucketResponse = await axios.post(`http://${dataUrl}:${dataPort}/create-bucket`, {
          bucketName: randomString
        });
    
        if (createBucketResponse.status !== 201) {
          await transaction.rollback();
          return res.status(createBucketResponse.status).json({ error: 'Error creating bucket' });
        }
      }
  
      await transaction.commit();
      res.status(201).json({ message: 'User registered', newUser });
  
    } catch (error) {
      await transaction.rollback();
  
      if (error.name === 'SequelizeUniqueConstraintError') {
        res.status(409).json({ error: 'User with this email already exists' });
      } else if (error.name === 'SequelizeDatabaseError') {
        res.status(500).json({ error: 'Database error occurred' });
      } else {
        res.status(500).json({ error: 'ERROR : Register user' });
      }
    }
  };
}

module.exports = new AuthController();