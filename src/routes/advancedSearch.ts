import { Router } from "express";
import {
  advancedSearch,
  getFilterOptions,
} from "../controllers/advancedSearchController";

const router = Router();

router.post("/", advancedSearch);
router.get("/filters", getFilterOptions);

export default router;
