const { Process }  = require('../Models');

class ProcessController {
  async create(req, res, next) {
    try {
      const { name, url, fixed_url } = req.body;
      if (!name || !url) {
        return res.status(400).json({ error: 'name and url are required' });
      }
      const newProcess = await Process.create({ name, url, fixed_url });
  
      return res.status(201).json({ message: 'Process created', newProcess });

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

  async all(req, res, next) {
    try {
        const process = await Process.findAll();
        if (!process) {
          return res.status(404).json({ error: 'Process not found' });
        }
        res.status(200).json({ message: 'Process found', process });
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
      const processid = Number(req.params.id);

      if (isNaN(processid)) {
        return res.status(400).json({ error: 'Invalid process ID' });
    }
      const process = await Process.findByPk(processid);
      if (!process) {
        return res.status(404).json({ error: 'Process not found' });
      }
      return res.status(201).json({ message: 'Process Found', process });
    
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
      const processid = Number(req.params.id);

      if (isNaN(processid)) {
          return res.status(400).json({ error: 'Invalid process ID' });
      }

      const [rowsUpdated, updatedProcess] = await Process.update(req.body, {
        where: { id: processid },
        returning: true,
      });
  
      if (updatedProcess > 0) {
        const process = await Process.findByPk(processid);
        if (!process) {
          return res.status(404).json({ error: 'Process not found' });
        }
        res.status(200).json({ message: 'Process updated successfully', process });
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

  async delete(req, res, next) {
    try {
      const processId = Number(req.params.id);

      if (isNaN(processId)) {
          return res.status(400).json({ error: 'Invalid user ID' });
      }
      const process = await Process.findByPk(processId);
      if (process) {
          await process.destroy();
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

module.exports = new ProcessController();