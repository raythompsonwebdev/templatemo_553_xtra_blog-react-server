import dbConnect from '../database/sql-connection.js'

const deletePost = (request, response) => {
  const id = parseInt(request.params.id);
  dbConnect.query(`DELETE * FROM blogpost WHERE id = ${id}`, (err, result, fields) => {
    if (err) response.status(500).json({ error: err.message });
    response.send(result);
  });

  response.redirect("http://localhost:3000");

  
}

export default deletePost
