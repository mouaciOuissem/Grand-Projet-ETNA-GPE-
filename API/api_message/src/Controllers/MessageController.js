
class MessageController {
    async listAllMessages(req, res) {
        res.status(200).send('OK');
    }

    async createMessage(req, res) {
        const { message } = req.body
        console.log(req.body)
        res.status(200).json(message);
        // const { content, sender } = req.body;
        // const message = { content, sender, createdAt: new Date() };
        // messages.push(message);
        // io.emit('newMessage', message);
        // res.status(201).send(message);
    }
}

module.exports = new MessageController();
