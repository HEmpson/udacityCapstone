const app = require('./index.js')

// Setup Serve
const port = 8080;
const server = app.listen(port, () => { console.log(`server running on ${port}`) });