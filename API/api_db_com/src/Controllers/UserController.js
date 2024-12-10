const axios = require('axios');

const { User , UserDetails , Bucket}  = require('../Models');
const dataUrl = process.env.SNL_URL_DATA;
const dataPort = process.env.SNL_PORT_DATA;

class UserController {
    async get(req, res, next) {
        try {
          const id = Number(req.params.id);

          if (isNaN(id)) {
              return res.status(400).json({ error: 'Invalid user ID' });
          }

          // const user = await User.findByPk(id);
          const user = await User.findByPk(id, {
            include: [
              {
                  model: UserDetails, 
                  as: 'userDetails' 
              }
            ]
          });

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

    async all(req, res, next) {
        try {
            const users = await User.findAll();
            if (!users) {
              return res.status(404).json({ error: 'Users not found' });
            }
            res.status(200).json({ message: 'Users found', users });
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

    async patchEmail(req, res, next) {
      try {
        const { email }  = req.body;

        if (!email ) {
          return res.status(400).json({ error: 'Email is required' });
        }
        const userid = Number(req.params.id);

        if (isNaN(userid)) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }
        const [rowsUpdated, updatedUser] = await User.update({ email: email }, {
          where: { id: userid },
          returning: true,
        });
        if (updatedUser > 0) {
          const user = await User.findByPk(userid);
          if (!user) {
            return res.status(404).json({ error: 'User not found' });
          }
          res.status(200).json({ message: 'Email updated successfully', user });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
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

    async patchPassword(req, res, next) {
        try {
          const { password } = req.body;
          if (!password ) {
            return res.status(400).json({ error: 'Password is required' });
          }
          const userid = Number(req.params.id);
  
          if (isNaN(userid)) {
              return res.status(400).json({ error: 'Invalid user ID' });
          }
          const [rowsUpdated, updatedUser] = await User.update({ password: password }, {
            where: { id: userid },
            returning: true,
          });
          if (updatedUser > 0) {
            const user = await User.findByPk(userid);
            if (!user) {
              return res.status(404).json({ error: 'User not found' });
            }
            res.status(200).json({ message: 'Password updated successfully', user });
          } else {
              res.status(404).json({ error: 'User not found' });
          }
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

    async patchRole(req, res, next) {
      try {
        const { role_id } = req.body;
        if (!role_id ) {
          return res.status(400).json({ error: 'role id is required' });
        }
        const userid = Number(req.params.id);

        if (isNaN(userid)) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }
        
        const [rowsUpdated, updatedUser] = await User.update({ role_id: role_id }, {
          where: { id: userid },
          returning: true,
        });
    
        if (updatedUser > 0) {
          const user = await User.findByPk(userid);
            if (!user) {
              return res.status(404).json({ error: 'User not found' });
            }
          res.status(200).json({ message: 'Role updated successfully', user });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
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

    async delete(req, res, next) {
      try {
        const userId = Number(req.params.id);

        if (isNaN(userId)) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }
        const user = await User.findByPk(userId, {
          include: [{
            model: UserDetails,
            as: 'userDetails',
            include: [{ model: Bucket, as: 'bucket' }] 
          }]
        });
        if (user) {
            const userDetails = user.userDetails.dataValues;
            const bucket = userDetails.bucket.dataValues.bucketName;

            const deleteBucketResponse = await axios.delete(`http://${dataUrl}:${dataPort}/delete-bucket`, { 
              data: { bucketName: bucket }
            });
            if (deleteBucketResponse.status !== 200) {
              return res.status(deleteBucketResponse.status).json({ error: 'Error deleting bucket' });
            }
            await user.destroy();
            res.status(200).json({ message: 'User deleted successfully' });
        } else {
          res.status(404).json({ error: 'User not found' });
        }
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
}

module.exports = new UserController();




// UPDATE UserDetails
// SET
//     firstname = 'demo_firstname',
//     lastname = 'demo_lastname',
//     address = '123 Elm Street',
//     post_code = '12345',
//     country = 'USA',
//     phone_number = '555-1234',
//     pronouns = 'he/him',
//     profile_picture = '/layout/images/login/profil.png',
//     birthday = '1990-01-01',
//     last_connection = '2024-09-07 15:02:25',
//     updatedAt = NOW()
// WHERE UserId = 1;

// UPDATE UserDetails
// SET
//     firstname = 'demo1_firstname',
//     lastname = 'demo1_lastname',
//     address = '123 Elm Street',
//     post_code = '12345',
//     country = 'USA',
//     phone_number = '555-1234',
//     pronouns = 'he/him',
//     profile_picture = '/layout/images/login/profil1.png',
//     birthday = '1995-12-05',
//     last_connection = '2024-09-07 15:02:25',
//     updatedAt = NOW()
// WHERE id = 2;

// UPDATE User
// SET role_id = 1
// WHERE id = 1;