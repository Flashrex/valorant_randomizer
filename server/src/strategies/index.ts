import { Router } from "express";

const router = Router();

import * as StrategyController from "./controller";

router.get("/", StrategyController.listStrategies);
router.get("/:id", StrategyController.getStrategy);
router.post("/", StrategyController.createStrategy);
router.put("/:id", StrategyController.updateStrategy);
router.delete("/:id", StrategyController.deleteStrategy);

export default router;