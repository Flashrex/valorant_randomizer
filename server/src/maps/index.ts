import { Router } from "express";

const router = Router();

import { listMaps } from "./controller";

router.get("/", listMaps);

export default router;