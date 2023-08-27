import dbConnect from '../database/sql-connection.js'

const getAllPost = (request, response) => {

  dbConnect.query("SELECT * FROM blogpost", function (err, result, fields) {
      if (err) response.status(500).json({ error: err.message });
      response.send(result);
    });
 
}

export default getAllPost
