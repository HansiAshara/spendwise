// ============================================
// Export Routes
// ============================================

import { Router }        from 'express'
import { protect }       from '../middleware/auth.middleware'
import { exportPDF, exportCSV, exportPreview } from '../controllers/export.controller'

const router = Router()

router.use(protect)

router.get('/preview', exportPreview)
router.get('/pdf',     exportPDF)
router.get('/csv',     exportCSV)

export default router