import { Router } from "express";
import { deleteShortenUrl, getShortenedUrl, postShortenUrl } from "../controllers/urlController.js";
import { validateSchemaMiddleware } from "../middlewares/validateSchemaMiddleware.js";
import { validateTokenMiddleware } from "../middlewares/validateTokenMiddleware.js";
import { urlSchema } from "../schemas/urlShema.js";

const urlRouter = Router();
urlRouter.post('/urls/shorten', validateTokenMiddleware, validateSchemaMiddleware(urlSchema), postShortenUrl);
urlRouter.get('/urls/:shortUrl', getShortenedUrl);
urlRouter.delete('/urls/:id', validateTokenMiddleware, deleteShortenUrl);

export default urlRouter;
