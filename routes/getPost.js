import dbConnect from '../database/sql-connection.js'

const getPost = (request, response) => {

  const id = parseInt(request.params.id);

  dbConnect.query(`SELECT * FROM blogpost WHERE id = ${id}`, (err, result, fields) => {
    if (err) response.status(500).json({ error: err.message });
    response.send(result);
  });

}

export default getPost
