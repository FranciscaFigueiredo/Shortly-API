import { v4 as uuid } from "uuid";
import { connection } from "../database.js";

export async function postShorten(req, res) {
    const { url } = req.body;

    const user = res.locals.user;

    const shortUrl = uuid().replaceAll('-', '');
  
    const result = await connection.query(`
        INSERT INTO "shortenedUrls"
            (url, "shortUrl", "userId")
        VALUES ($1, $2, $3)
        RETURNING *;`
    , [url, shortUrl, user.id]);

    const shortUrlResponse = JSON.stringify({ "shortUrl": `${result.rows[0].shortUrl}`});

    res.send(shortUrlResponse);
}
