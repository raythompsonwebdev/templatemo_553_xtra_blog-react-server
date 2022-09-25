import db from "../database/connection.js";

export default function searchPost(request, response) {
  try {
    db.query("SELECT * FROM blogposter", (error, results) => {
      if (error) {
        throw error;
      } else {
        const posts = results.rows;

        response.send(posts);
      }
    });
  } catch (err) {
    response.status(500).json({ error: err.message });
  }
}
