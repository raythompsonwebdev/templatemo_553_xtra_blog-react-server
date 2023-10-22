import dbConnect from '../database/sql-connection.js'

const searchPost = (request, response) => { 

  const {query} = request.query;

  console.log(query)
  
  dbConnect.execute(`SELECT * FROM blogpost WHERE blogtitle = ?`,[query], (err, result) => {
  if (err) response.status(500).json({ error: err.message });
      console.log(result);
    });
  
}

export default searchPost
