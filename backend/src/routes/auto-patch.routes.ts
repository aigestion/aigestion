import { Request, Response, Router } from 'express';
import { AutoPatchService } from '../services/auto-patch.service';
import { logger } from '../utils/logger';

const router = Router();
const autoPatchService = new AutoPatchService();

/**
 * Auto Patch Routes
 */

// Scan for outdated packages
router.get('/scan', async (req: Request, res: Response) => {
  try {
    const packages = await autoPatchService.scanOutdatedPackages();

    res.json({
      success: true,
      data: packages,
    });
  } catch (error) {
    logger.error('Error scanning packages:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to scan packages',
    });
  }
});

// Create patch job
router.post('/patch', async (req: Request, res: Response) => {
  try {
    const { packageName, type, targetVersion } = req.body;

    if (!packageName || !type) {
      return res.status(400).json({
        success: false,
        error: 'packageName and type are required',
      });
    }

    if (!['npm', 'pip', 'system'].includes(type)) {
      return res.status(400).json({
        success: false,
        error: 'type must be npm, pip, or system',
      });
    }

    const job = await autoPatchService.createPatchJob(packageName, type, targetVersion);

    res.json({
      success: true,
      data: job,
    });
  } catch (error) {
    logger.error('Error creating patch job:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create patch job',
    });
  }
});

// Get patch jobs
router.get('/jobs', (req: Request, res: Response) => {
  try {
    const jobs = autoPatchService.getPatchJobs();

    res.json({
      success: true,
      data: jobs,
    });
  } catch (error) {
    logger.error('Error getting patch jobs:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get patch jobs',
    });
  }
});

// Get patch policies
router.get('/policies', (req: Request, res: Response) => {
  try {
    const policies = autoPatchService.getPatchPolicies();

    res.json({
      success: true,
      data: policies,
    });
  } catch (error) {
    logger.error('Error getting patch policies:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get patch policies',
    });
  }
});

// Add patch policy
router.post('/policies', (req: Request, res: Response) => {
  try {
    const policy = req.body;

    if (!policy.name || !policy.schedule) {
      return res.status(400).json({
        success: false,
        error: 'name and schedule are required',
      });
    }

    autoPatchService.addPatchPolicy(policy);

    res.json({
      success: true,
      message: 'Patch policy added successfully',
    });
  } catch (error) {
    logger.error('Error adding patch policy:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add patch policy',
    });
  }
});

// Get patch statistics
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const stats = await autoPatchService.getStats();

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    logger.error('Error getting patch stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get patch statistics',
    });
  }
});

// Get patch health
router.get('/health', (req: Request, res: Response) => {
  try {
    const health = {
      status: 'healthy',
      service: 'auto-patch',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: '1.0.0',
    };

    res.json({
      success: true,
      data: health,
    });
  } catch (error) {
    logger.error('Error getting patch health:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get patch health',
    });
  }
});

export default router;
