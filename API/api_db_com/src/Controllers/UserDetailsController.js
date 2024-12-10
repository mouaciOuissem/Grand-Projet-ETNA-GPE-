const { Bucket, UserDetails, UserFiscalDetails, SocialCategorie }  = require('../Models');
const { sequelize } = require('../Models');
class UserDetailsController {
  async get(req, res, next) {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) {
          return res.status(400).json({ error: 'Invalid user ID' });
      }

      const userDetails = await UserDetails.findByPk(id, {
        include: [
          {
            model: UserFiscalDetails, 
            as: 'userFiscalDetails' ,
          },
          {
            model: SocialCategorie,
            as: 'socialCategorie'
          },
          {
            model: Bucket,
            as: 'bucket'
          }
        ]
      });

      if (!userDetails) {
        return res.status(404).json({ error: 'User Details not found' });
      }
      res.status(200).json({ message: 'User found', userDetails });
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

  async patch(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) {
          return res.status(400).json({ error: 'Invalid user ID' });
      }
      const { fiscal_details, social_categorie, ...userDetailsData } = req.body;

      const [rowsUpdated, updatedUserDetails] = await UserDetails.update(userDetailsData, {
        where: { id: id },
        returning: true,
        transaction,
      });
  
      if (updatedUserDetails > 0) {
        const userDetails = await UserDetails.findByPk(id, { transaction });

        if (!userDetails) {
          await transaction.rollback();
          return res.status(404).json({ error: 'User Details not found' });
        }
         
        await UserFiscalDetails.update(fiscal_details, {
          where: { UserdetailsId: userDetails.id },
          returning: true,
          transaction,
        });

        await SocialCategorie.update(social_categorie, {
          where: { UserdetailsId: userDetails.id },
          returning: true,
          transaction,
        });
        const UpdateuserDetails = await UserDetails.findByPk(id, {
          include: [
            {
              model: UserFiscalDetails,
              as: 'userFiscalDetails',
            },
            { 
              model: SocialCategorie,
              as: 'socialCategorie'
            }
          ],
          transaction,
        });
  
        await transaction.commit();
        res.status(200).json({ message: 'User Details updated successfully', UpdateuserDetails });
    } else {
      await transaction.rollback();
      res.status(404).json({ error: 'User Details not found' });
    }
    } catch (error) {
      await transaction.rollback(); 
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

module.exports = new UserDetailsController();