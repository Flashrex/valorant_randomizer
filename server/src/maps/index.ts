import { Router } from "express";

const router = Router();

import * as MapController from "./controller";

router.get("/", MapController.listMaps);

export default router;