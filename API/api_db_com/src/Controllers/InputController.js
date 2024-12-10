const { Input }  = require('../Models');

class InputController {
  async create(req, res, next) {
    try {
      const { type, target, css_target_id } = req.body;

      if (!type || !target || !css_target_id) {
        return res.status(400).json({ error: 'type or target or css_target_id are required' });
      }
      
      const newInput = await Input.create({ type, target, css_target_id});

      res.status(201).json({ message: 'Input created', newInput });
    } catch (error) {

      if (error.name === 'SequelizeUniqueConstraintError') {
        res.status(409).json({ error: 'Input already exists' });
      } else if (error.name === 'SequelizeDatabaseError') {
          res.status(500).json({ error: 'Database error occurred' });
      } else {
          res.status(500).json({ error: 'ERROR : Register user' });
      }
    }
  };

  async all(req, res, next) {
    try {
        const input = await Input.findAll();
        if (!input) {
          return res.status(404).json({ error: 'Input not found' });
        }
        res.status(200).json({ message: 'Input found', input });
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
      const inputid = Number(req.params.id);

      if (isNaN(inputid)) {
        return res.status(400).json({ error: 'Invalid input ID' });
    }
      const input = await Input.findByPk(inputid);

      if(input) {
        return res.status(201).json({ message: 'Input Found', input });
      } else {
        return res.status(201).json({ message: 'Input Not Found' });
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

  async patch(req, res, next) {
    try {
      const inputid = Number(req.params.id);
      if (isNaN(inputid)) {
          return res.status(400).json({ error: 'Invalid input ID' });
      }

      const [rowsUpdated, updatedInput] = await Input.update(req.body, {
        where: { id: inputid },
        returning: true,
      });
  
      if (updatedInput > 0) {
        const input = await Input.findByPk(inputid);
        if (!input) {
          return res.status(404).json({ error: 'Input not found' });
        }
        res.status(200).json({ message: 'Input updated successfully', input });
    } else {
        res.status(404).json({ error: 'Input updated fail' });
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
      const inputId = Number(req.params.id);

      if (isNaN(inputId)) {
          return res.status(400).json({ error: 'Invalid user ID' });
      }
      const input = await Input.findByPk(inputId);
      if (input) {
          await input.destroy();
          res.status(200).json({ message: 'Input deleted successfully' });
      } else {
        res.status(404).json({ error: 'Input not found' });
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

module.exports = new InputController();