const express = require("express");
const db = require("./db");
const bodyParser = require("body-parser");
const cors = require("cors");
const routes = require("./routes");
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {

    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (req.path === "/api/login") {
        next()
        return
    }

    if (token == null) return res.sendStatus(401)
  
    jwt.verify(token, '123456', (err, data) => {

      if (err) return res.sendStatus(403)
  
      req.data = data
      const users = db.getCollection("users");
      const user = users.findOne({ userID: data.userID });
    
        if (!user) {
            res.status(Response.NOT_AUTHORIZED).json(Response.unauthorized);
            return;
        }
  
      next()
    })
  }

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(authenticateToken)

app.use("/api", routes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
