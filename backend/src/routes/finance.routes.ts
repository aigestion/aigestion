import { Router } from 'express';
import { container } from '../config/inversify.config';
import { FinanceDashboardController } from '../controllers/finance-dashboard.controller';

const router = Router();

// Manually resolve controller since we aren't using InversifyExpressServer for this part
// or we can just use the controller methods if they are bound.

// We need to ensure the controller is bound in the container.
// Usually controllers are bound in inversify.config.ts or auto-bound.
// If not, we can just instantiate it here or bind it dynamically.
// For now, let's assume manual resolution for simplicity/speed if checking binding is hard.
// Actually, let's check binding.

// But to be safe and quick:
router.get('/strategy', async (req, res) => {
  // We can try to get it from container if bound, else manual.
  // Let's assume manual instantiation if not bound is safer for immediate fix?
  // No, dependencies (services) need to be injected.
  // So we MUST use container.

  // We need to bind the controller if it's not bound.
  if (!container.isBound(FinanceDashboardController)) {
    container.bind(FinanceDashboardController).to(FinanceDashboardController);
  }

  const controller = container.get(FinanceDashboardController);
  return controller.getStrategy(req, res);
});

router.get('/alerts', async (req, res) => {
  if (!container.isBound(FinanceDashboardController)) {
    container.bind(FinanceDashboardController).to(FinanceDashboardController);
  }
  const controller = container.get(FinanceDashboardController);
  return controller.getAlerts(req, res);
});

router.get('/portfolio', async (req, res) => {
  if (!container.isBound(FinanceDashboardController)) {
    container.bind(FinanceDashboardController).to(FinanceDashboardController);
  }
  const controller = container.get(FinanceDashboardController);
  return controller.getPortfolio(req, res);
});

export default router;
