import { v4 as uuid } from "uuid";
import { connection } from "../database.js";

export async function postShortenUrl(req, res) {
    const { url } = req.body;

    const { user } = res.locals;

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

export async function deleteShortenUrl(req, res) {
    const { id } = req.params;

    const { user } = res.locals;

    try {
        const result = await connection.query(`
            DELETE FROM "shortenedUrls"
            WHERE 
                "shortenedUrls".id = $1
            AND "userId" = $2
            RETURNING *;`
        , [id, user.id]);

        if (!result.rowCount) {
            return res.sendStatus(401);
        }

        return res.sendStatus(204);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}