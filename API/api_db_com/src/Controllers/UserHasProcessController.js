const { UserHasProcess, Process, Status }  = require('../Models');

class UserHasProcessController {
  async create(req, res, next) {
    try {
      const UserId = Number(req.params.UserId);
      const { ProcessId, StatusId } = req.body;

      if (!ProcessId || !UserId || !StatusId) {
        return res.status(400).json({ error: 'ProcessId, UserId and StatusId are required' });
      }
      const newUserHasProcess = await UserHasProcess.create({ ProcessId: ProcessId, UserId: UserId, StatusId: StatusId });
  
      return res.status(201).json({ message: 'new UserHasProcess created', newUserHasProcess });
    
    } catch (error) {
      console.log(error)
      if (error.name === 'SequelizeUniqueConstraintError') {
        res.status(409).json({ error: 'Process already exists' });
      } else if (error.name === 'SequelizeDatabaseError') {
          res.status(500).json({ error: 'Database error occurred' });
      } else {
          res.status(500).json({ error: 'ERROR : Register user' });
      }
    }
  };

  async all(req, res, next) {
    try {
      const id = Number(req.params.UserId);

      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }
      const userHasProcess = await UserHasProcess.findAll({
        where: { UserId: id },
        include: [
          {
            model: Status,
            as: 'Status',
            attributes: ['name']
          },
          {
            model: Process,
            as: 'Process' ,
            attributes: ['name', 'url']
          }
        ],
      });
      if (!userHasProcess) {
        return res.status(404).json({ error: 'UserHasProcess not found' });
      }
      res.status(200).json({ message: 'UserHasProcess found', userHasProcess });
    } catch (error) {
      console.log(error)
      if (error.name === 'SequelizeDatabaseError') {
        res.status(500).json({ error: 'Database error occurred' });
      } else if (error.name === 'SequelizeConnectionError') {
        res.status(500).json({ error: 'Database connection error' });
      } else {
        res.status(500).json({ error: 'ERROR : Login user' });
      }
    }
  };
  
  async get(req, res, next) {
    try {
      const userHasProcessId = Number(req.params.id);

      if (isNaN(userHasProcessId)) {
        return res.status(400).json({ error: 'Invalid userHasProcess ID' });
    }
      const userHasProcess = await UserHasProcess.findByPk(userHasProcessId, {
        include: [
          {
            model: Status,
            as: 'Status',
            attributes: ['name']
          },
          {
            model: Process,
            as: 'Process' ,
            attributes: ['name', 'url']
          }
        ],
      });
  
      return res.status(201).json({ message: 'UserHasProcess Found', userHasProcess });
    
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
    try {
      const { StatusId } = req.body;

      if (!StatusId) {
        return res.status(400).json({ error: 'StatusId are required' });
      }

      const userHasProcessId = Number(req.params.id);
  
      if (isNaN(userHasProcessId)) {
          return res.status(400).json({ error: 'Invalid user ID' });
      }

      const [rowsUpdated, updatedUserHasProcess] = await UserHasProcess.update({StatusId: StatusId}, {
        where: { id: userHasProcessId },
        returning: true,
      });

      if (updatedUserHasProcess > 0) {
        const userHasProcess = await UserHasProcess.findByPk(userHasProcessId, {
          include: [
            {
              model: Status,
              as: 'Status',
              attributes: ['name']
            },
            {
              model: Process,
              as: 'Process' ,
              attributes: ['name', 'url']
            }
          ],
        });
        if (!userHasProcess) {
          return res.status(404).json({ error: 'UserHasProcess not found' });
        }
        res.status(200).json({ message: 'UserHasProcess updated successfully', userHasProcess });
      } else {
          res.status(404).json({ error: 'UserHasProcess not found' });
      }
    
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        res.status(409).json({ error: 'Process already exists' });
      } else if (error.name === 'SequelizeDatabaseError') {
          res.status(500).json({ error: 'Database error occurred' });
      } else {
          res.status(500).json({ error: 'ERROR : Register user' });
      }
    }
  };

  async delete(req, res, next) {
    try {
      const userHasProcessId = Number(req.params.id);

      if (isNaN(userHasProcessId)) {
          return res.status(400).json({ error: 'Invalid userHasProcess ID' });
      }
      const userHasProcess = await UserHasProcess.findByPk(userHasProcessId);
      if (userHasProcess) {
          await userHasProcess.destroy();
          res.status(200).json({ message: 'Process deleted successfully' });
      } else {
        res.status(404).json({ error: 'Process not found' });
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

module.exports = new UserHasProcessController();