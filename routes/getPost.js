import db from "../database/connection.js";

export default function getPost(request, response) {
  try {
    // convert string to number
    const id = parseInt(request.params.id);

    db.query("SELECT * FROM blogposter WHERE id = $1", [id]).then((result) => {
      const postItem = result.rows[0];
      response.send(postItem);
      //console.log(postItem);
    });
  } catch (err) {
    response.status(500).json({ error: err.message });
  }
}
