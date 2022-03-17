export async function postShorten(req, res) {
    const { url } = req.body;
  
    await connection.query('INSERT INTO "shortenedUrls" WHERE email=$1', [email])
  
    if (bcrypt.compareSync(password, user.password)) {
      const token = uuid();
      await connection.query('INSERT INTO sessions (token, "userId") VALUES ($1, $2)', [token, user.id])
      return res.send(token);
    }
  
    res.sendStatus(401);
}