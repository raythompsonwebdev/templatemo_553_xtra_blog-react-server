import dbConnect from '../database/sql-connection.js'

const searchPost = (request, response) => { 
  dbConnect.query("SELECT * FROM blogposter", (err, result, fields) => {
if (err) response.status(500).json({ error: err.message });
    console.log(result);
  });
 
}

export default searchPost
