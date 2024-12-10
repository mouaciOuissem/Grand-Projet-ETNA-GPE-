const { Status }  = require('../Models');

class StatusController {
  async create(req, res, next) {
    try {
      const { name } = req.body;

      if (!name) {
        return res.status(400).json({ error: 'name are required' });
      }
      const newStatus = await Status.create({ name });
    
      res.status(201).json({ message: 'Status created', newStatus });
    } catch (error) {

      if (error.name === 'SequelizeUniqueConstraintError') {
        res.status(409).json({ error: 'Status already exists' });
      } else if (error.name === 'SequelizeDatabaseError') {
          res.status(500).json({ error: 'Database error occurred' });
      } else {
          res.status(500).json({ error: 'ERROR : Register user' });
      }
    }
  };

  async all(req, res, next) {
    try {
        const status = await Status.findAll();
        if (!status) {
          return res.status(404).json({ error: 'Status not found' });
        }
        res.status(200).json({ message: 'Status found', status });
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

  async get(req, res, next) {
    try {
      const statusid = Number(req.params.id);

      if (isNaN(statusid)) {
        return res.status(400).json({ error: 'Invalid status ID' });
    }
      const status = await Status.findByPk(statusid);
  
      return res.status(201).json({ message: 'Status Found', status });
    
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
      const { name } = req.body;
      if (!name ) {
        return res.status(400).json({ error: 'name and id is required' });
      }
      const statusid = Number(req.params.id);

      if (isNaN(statusid)) {
          return res.status(400).json({ error: 'Invalid status ID' });
      }
      
      const [rowsUpdated, updatedStatus] = await Status.update({ name: name }, {
        where: { id: statusid },
        returning: true,
      });
  
      if (updatedStatus > 0) {
        const status = await Status.findByPk(statusid);
          if (!status) {
            return res.status(404).json({ error: 'Status not found' });
          }
        res.status(200).json({ message: 'Status updated successfully', status });
      } else {
          res.status(404).json({ error: 'Status not found' });
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
      const statusId = Number(req.params.id);

      if (isNaN(statusId)) {
          return res.status(400).json({ error: 'Invalid user ID' });
      }
      const status = await Status.findByPk(statusId);
      if (status) {
          await status.destroy();
          res.status(200).json({ message: 'Status deleted successfully' });
      } else {
        res.status(404).json({ error: 'Status not found' });
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

module.exports = new StatusController();