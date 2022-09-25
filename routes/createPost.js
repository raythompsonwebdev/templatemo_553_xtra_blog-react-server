import db from "../database/connection.js";

export default function createPost(request, response) {
  const { author, blogtitle, blogpost, category, submitted } = request.body;
  db.query(
    `INSERT INTO blogposter(author, blogtitle, blogpost, submitted) VALUES ($1, $2, $3, $4)`,
    [author, blogtitle, blogpost, category, submitted]
  )
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      response.status(500).json({ error: error.message });
      // do stuff with the error here
    });

  response.redirect("http://localhost:3000");
}
