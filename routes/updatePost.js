import dbConnect from '../database/sql-connection.js'

const updatePost = (request, response) => {
  const { id, name, blogtitle, blogpost, category, submitted } = request.body;

  dbConnect.query(    ` 
      UPDATE blogposter 
      SET name = ${name}, 
      SET blogtitle = ${blogtitle}, 
      SET blogpost = ${blogpost}, 
      SET category = ${category}, 
      SET date = ${submitted}
      WHERE id = ${id}
    `,(err, result, fields) => {
      console.log(fields)
      if (err) response.status(500).json({ error: err.message });
      console.log(result);
      response.send(result);
    });


  response.redirect("/posts");


}

export default updatePost;
