import express from 'express'

const app = express();
const port = 5000;
app.use(express.static('D:/Programming/Git/1/public'));
app.get('/',(request, response) => {
    response.sendfile('index.html');
});
app.listen(port,() => console.log(`Running on port ${port}`));