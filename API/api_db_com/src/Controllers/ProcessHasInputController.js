const { Input, Process, ProcessHasInput}  = require('../Models');

class ProcessHasInputController {
  async create(req, res, next) {
    try {
      const { ProcessId, Inputid, page, rank } = req.body;

      if (!ProcessId || !Inputid || !page || !rank) {
        return res.status(400).json({ error: 'ProcessId or Inputid or page are required' });
      }
      const newProcessHasInput = await ProcessHasInput.create({ ProcessId, Inputid, page, rank});

      res.status(201).json({ message: 'ProcessHasInput created', newProcessHasInput });
    } catch (error) {

      if (error.name === 'SequelizeUniqueConstraintError') {
        res.status(409).json({ error: 'ProcessHasInput already exists' });
      } else if (error.name === 'SequelizeDatabaseError') {
          res.status(500).json({ error: 'Database error occurred' });
      } else {
          res.status(500).json({ error: 'ERROR : Register user' });
      }
    }
  };

  async get(req, res, next) {
      try {
        const id = Number(req.params.ProcessId);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid Process ID' });
        }
        const process_information = await ProcessHasInput.findAll({
          where: { ProcessId: id },
          include: [
            {
              model: Input,
              attributes: ['id', 'type', 'target', 'css_target_id']
            },
            {
              model: Process,
              attributes: ['id', 'name', 'url']
            }
          ],
          attributes: ['page', 'rank']
        });
        
        if (!process_information || process_information.length === 0) {
          return res.status(404).json({ error: 'Process with input not found' });
        }

        const processDetails = {
          id: process_information[0].Process.id,
          name: process_information[0].Process.name,
          url: process_information[0].Process.url
        };

        const inputsGroupedByPage = process_information.map(info => ({
          page: info.page,
          rank: info.rank,
          input: info.Input
        }));
        
        res.status(200).json({
          message: 'Process with input',
          process: processDetails,
          input: inputsGroupedByPage
        });
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

  async getbyUrl(req, res, next) {
    try {
      const { url } = req.body
      if (!url) {
          return res.status(400).json({ error: 'Invalid Process url' });
      }
      const process_information = await ProcessHasInput.findAll({
        include: [
          {
            model: Input,
            attributes: ['id', 'type', 'target', 'css_target_id']
          },
          {
            model: Process,
            attributes: ['id', 'name', 'url'],
            where: { url: url }
          }
        ],
        attributes: ['page', 'rank']
      });
      
      if (!process_information || process_information.length === 0) {
        return res.status(404).json({ error: 'Process with input not found' });
      }

      const processDetails = {
        id: process_information[0].Process.id,
        name: process_information[0].Process.name,
        url: process_information[0].Process.url
      };

      const inputsGroupedByPage = process_information.map(info => ({
        page: info.page,
        rank: info.rank,
        input: info.Input
      }));
      
      res.status(200).json({
        message: 'Process with input',
        process: processDetails,
        input: inputsGroupedByPage
      });
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

  async patch(req, res, next) {
    try {
      const processId = Number(req.params.ProcessId);
      const inputId = Number(req.params.Inputid);

      const { newInputId } = req.body;

      if (isNaN(processId) || isNaN(inputId) || !newInputId) {
          return res.status(400).json({ error: 'Invalid process ID' });
      }

      const [rowsUpdated, updatedProcessHasInput] = await ProcessHasInput.update({Inputid: newInputId}, {
        where: { ProcessId: processId, Inputid: inputId },
        returning: true,
      });
  
      if (updatedProcessHasInput > 0) {
        const process_information = await ProcessHasInput.findAll({
          where: { ProcessId: processId },
          include: [
            {
              model: Input,
              attributes: ['id', 'type', 'target', 'css_target_id']
            },
            {
              model: Process,
              attributes: ['id', 'name', 'url']
            }
          ],
          attributes: ['page', 'rank']
        });
        
        if (!process_information || process_information.length === 0) {
          return res.status(404).json({ error: 'Process with input not found' });
        }

        const processDetails = {
          id: process_information[0].Process.id,
          name: process_information[0].Process.name,
          url: process_information[0].Process.url
        };

        const inputsGroupedByPage = process_information.map(info => ({
          page: info.page,
          rank: info.rank,
          input: info.Input
        }));
        res.status(200).json({
          message: 'ProcessHasInput updated successfully',
          process: processDetails,
          inputs: inputsGroupedByPage
        });
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
      const processId = Number(req.params.ProcessId);
      const inputId = Number(req.params.Inputid);

      if (isNaN(processId) || isNaN(inputId)) {
          return res.status(400).json({ error: 'Invalid process ID' });
      }

      const rowsDeleted = await ProcessHasInput.destroy({
        where: {
            ProcessId: processId,
            Inputid: inputId
        }
      });
  
      if (rowsDeleted > 0) {
        res.status(200).json({ message: 'Input deleted successfully from process' });
      } else {
          res.status(404).json({ error: 'Process or input not found' });
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

module.exports = new ProcessHasInputController();