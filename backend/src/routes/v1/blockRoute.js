import express from 'express'
import { blockController } from '../../controllers/blockController.js'
import { authMiddleware } from '../../middlewares/authMiddleware.js'

const Router = express.Router()

// GET /api/v1/blocks/metadata — Không cần auth (public)
Router.route('/metadata')
  .get(blockController.getMetadata)

// POST /api/v1/blocks/batch-code — Tạm thời gỡ auth cho V2
Router.route('/batch-code')
  .post(blockController.getBatchCode)

export const blockRoute = Router
