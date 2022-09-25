import db from "../database/connection.js";

export default function updatePost(request, response) {
  const { id, name, blogtitle, blogpost, category, submitted } = request.body;
  db.query(
    ` 
      UPDATE blogposter 
      SET name = $2, 
      SET blogtitle = $3, 
      SET blogpost = $4, 
      SET category = $5, 
      SET date = $6
      WHERE id = $1
    `,
    [name, blogtitle, blogpost, category, submitted]
  ).then((data) => {
    console.log(data);
  });

  response.redirect("/posts");
}
