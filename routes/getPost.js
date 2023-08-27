import dbConnect from '../database/sql-connection.js'

const getPost = (request, response) => {

  //let user = Number(req.params.id);  
  const id = parseInt(request.params.id);

  dbConnect.query(`SELECT * FROM blogpost WHERE id = ${id}`, (err, result, fields) => {

    if (err) response.status(500).json({ error: err.message });
    //console.log(result[id]); show post from post array in returned from database.
    response.send(result);
  });

}

export default getPost
