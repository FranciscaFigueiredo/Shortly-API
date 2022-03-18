import { Router } from "express";
import { postShorten } from "../controllers/urlController.js";
import { validateSchemaMiddleware } from "../middlewares/validateSchemaMiddleware.js";
import { validateTokenMiddleware } from "../middlewares/validateTokenMiddleware.js";
import { urlSchema } from "../schemas/urlShema.js";

const urlRouter = Router();
urlRouter.post('/urls/shorten', validateTokenMiddleware, validateSchemaMiddleware(urlSchema), postShorten);

export default urlRouter;
