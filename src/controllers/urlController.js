import { v4 as uuid } from "uuid";
import { connection } from "../database.js";

export async function postShortenUrl(req, res) {
    const { url } = req.body;

    const user = res.locals.user;

    const shortUrl = uuid().replaceAll('-', '');
  
    const result = await connection.query(`
        INSERT INTO "shortenedUrls"
            (url, "shortUrl", "userId")
        VALUES ($1, $2, $3)
        RETURNING "shortUrl";`
    , [url, shortUrl, user.id]);

    res.status(201).send(result.rows[0]);
}

export async function getShortenedUrl(req, res) {
    const { shortUrl } = req.params;
  
    const shortenedUrl = await connection.query(`
        SELECT 
            id, "shortUrl", url
        FROM "shortenedUrls"
        WHERE "shortUrl" = $1;`
    , [shortUrl]);

    if (!shortenedUrl.rowCount) {
        return res.sendStatus(404);
    }

    res.status(200).send(shortenedUrl.rows[0]);
}