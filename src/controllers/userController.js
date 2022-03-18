import bcrypt from 'bcrypt';
import { connection } from '../database.js';

export async function createUser(req, res) {
    const user = req.body;

    try {
        const existingUsers = await connection.query('SELECT * FROM users WHERE email=$1', [user.email])
        if (existingUsers.rowCount > 0) {
        return res.sendStatus(409);
        }

        const passwordHash = bcrypt.hashSync(user.password, 10);

        await connection.query(`
            INSERT INTO 
                users(name, email, password) 
            VALUES ($1, $2, $3)
        `, [user.name, user.email, passwordHash])

        res.sendStatus(201);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

export async function getUser(req, res) {
    const { user } = res.locals;

    try {
        res.send(user);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

export async function getUserById(req, res) {
    const { id } = req.params;

    try {
        const user = await connection.query({
            text: `
                SELECT
                    users.id, users.name,
                    SUM("shortenedUrls"."visitCount") AS "visitCount",
                    "shortenedUrls"
                FROM users
                JOIN "shortenedUrls"
                    ON users.id = "userId"
                WHERE users.id = $1
                GROUP BY users.id, "shortenedUrls".id;
            `,
            rowMode: 'array',
        }, [id]);
        const shortenedUrlsByUser = [];
        const shortenedUrlsResult = user.rows.map((row) => {
            let [
                id,
                name,
                visitCount,
                shortenedUrls,
            ] = row;
            
            shortenedUrls = shortenedUrls.replace('(', '').replace(')', '').split(',');
            console.log(shortenedUrls);
                const [
                    idUrl,
                    url,
                    shortUrl,
                    userId,
                    visitCountUrl,
                ] = shortenedUrls;

                shortenedUrlsByUser.push({
                    id: idUrl,
                    shortUrl,
                    url,
                    visitCount: visitCountUrl,
                });

            return {
                id,
                name,
                visitCount,
                shortenedUrls: {
                    id: idUrl,
                    shortUrl,
                    url,
                    visitCount: visitCountUrl,
                },
            };
        });
        return res.send({
            ...shortenedUrlsResult[shortenedUrlsResult.length - 1],
            shortenedUrls: shortenedUrlsByUser,
        })
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}