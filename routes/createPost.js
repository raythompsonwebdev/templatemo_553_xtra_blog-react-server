import dbConnect from '../database/sql-connection.js'

const createPost = (request, response) => {
  const { author, blogtitle, blogpost, category, submitted } = request.body;
  dbConnect.query(
    `INSERT INTO blogposter(author, blogtitle, blogpost, submitted) VALUES (${author}, ${blogtitle}, ${blogpost}, ${submitted})`,
    (err, result, fields) => {
      if (err) response.status(500).json({ error: err.message });
      response.send(result);
    });
  response.redirect("http://localhost:3000");  
}

export default createPost
