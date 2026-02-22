import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { User } from '../models/User';
import { logger } from '../utils/logger';
import { container } from '../config/inversify.config';
import { TYPES } from '../types';
import { DevicePostureService } from '../services/device-posture.service';

// Extender la interfaz Request para incluir la propiedad user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
      };
    }
  }
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  // 0. Bypass for God Mode Authority or existing service-to-service user
  const authorityKey = req.headers['x-nexus-authority'];
  if (authorityKey === 'NEXUS_GOD_2026_SOVEREIGN') {
    // SECURITY PATCH: Verify IP source (Localhost or Docker Internal)
    const clientIP = req.ip || req.connection.remoteAddress || '';
    const isLocal =
      clientIP === '127.0.0.1' ||
      clientIP === '::1' ||
      clientIP.startsWith('172.') || // Docker Bridge (Standard)
      clientIP.startsWith('10.'); // Docker Network

    if (!isLocal && process.env.NODE_ENV === 'production') {
      logger.warn(`[Auth] BLOCKED Unauthorized God Mode attempt from IP: ${clientIP}`);
      return next(new Error('Unauthorized Access Pattern'));
    }

    (req as any).user = {
      id: 'god-mode-sovereign',
      email: 'god@nexus.sovereign',
      role: 'god',
    };
    logger.warn(`[Auth] God Mode access granted via X-Nexus-Authority from IP: ${clientIP}`);
    return next();
  }

  if ((req as any).user) {
    return next();
  }

  let token: string | undefined;

  // Obtener el token del encabezado Authorization
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  // Obtener el token de las cookies (opcional)
  else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  // Verificar si existe el token
  if (!token) {
    (res as any).status(401).json({
      success: false,
      message: 'No autorizado. Por favor inicie sesión para continuar.',
    });
    return;
  }

  try {
    // 1. Verificar firma del token
    const decoded = jwt.verify(token, config.jwt.secret) as {
      id: string;
      email: string;
      role: string;
      iat: number;
      tokenVersion?: number;
      fingerprint?: {
        ip: string;
        userAgent: string;
        deviceId?: string;
      };
    };

    // 2. Verificar fingerprint y Device Posture (Zero Trust)
    if (decoded.fingerprint) {
      const currentUserAgent = req.headers['user-agent'] || 'unknown';

      // UA Mismatch check
      if (
        process.env.NODE_ENV === 'production' &&
        decoded.fingerprint.userAgent !== currentUserAgent
      ) {
        logger.warn(
          `UA Mismatch: ${decoded.id}. Token: ${decoded.fingerprint.userAgent} vs Req: ${currentUserAgent}`
        );
        (res as any).status(401).json({ success: false, message: 'Sesión inválida.' });
        return;
      }

      // Device Posture Check
      if (decoded.fingerprint.deviceId) {
        const devicePostureService = container.get<DevicePostureService>(
          TYPES.DevicePostureService
        );
        const postureCheck = await devicePostureService.verifyDevice(decoded.id, {
          deviceId: decoded.fingerprint.deviceId,
          os: 'unknown', // Would extract from UA or other headers
          browser: currentUserAgent,
        });

        if (!postureCheck.isCompliant && (decoded.role === 'god' || decoded.role === 'admin')) {
          logger.warn(`Security Breach attempt: Non-compliant device for role ${decoded.role}`, {
            userId: decoded.id,
            reason: postureCheck.reason,
          });
          (res as any).status(403).json({
            success: false,
            message: `Acceso denegado: Dispositivo no cumple con las políticas de seguridad (${postureCheck.reason}).`,
          });
          return;
        }
      }
    }

    // 3. Verificar persistencia en DB (CRÍTICO)
    const user = await User.findById(decoded.id).select('+tokenVersion +lastPasswordChange');

    if (!user) {
      (res as any).status(401).json({ success: false, message: 'El usuario ya no existe.' });
      return;
    }

    // 4. Verificar versión del token (Revocación Instantánea)
    // Si el usuario incrementó su versión (logout global), tokens viejos mueren.
    if (user.tokenVersion && decoded.tokenVersion !== undefined) {
      if (decoded.tokenVersion !== user.tokenVersion) {
        (res as any)
          .status(401)
          .json({ success: false, message: 'Token revocado. Inicie sesión nuevamente.' });
        return;
      }
    }

    // 5. Verificar cambio de contraseña reciente
    // Si la contraseña cambió después de emitir el token, revocar.
    if (user.lastPasswordChange) {
      const changedTimestamp = Math.floor(user.lastPasswordChange.getTime() / 1000);
      if (decoded.iat < changedTimestamp) {
        (res as any).status(401).json({
          success: false,
          message: 'Contraseña cambiada recientemente. Inicie sesión nuevamente.',
        });
        return;
      }
    }

    // Añadir usuario al objeto request
    (req as any).user = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error: any) {
    logger.error(
      {
        error: error.message,
        name: error.name,
        stack: error.stack,
        token: token?.substring(0, 10) + '...', // Log only start of token for security
      },
      'Auth Middleware Error'
    );
    (res as any).status(401).json({
      success: false,
      message: 'Sesión inválida o expirada.',
    });
    return;
  }
};

// Middleware para verificar roles de usuario
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!(req as any).user || !roles.includes((req as any).user.role)) {
      (res as any).status(403).json({
        success: false,
        message: `El rol ${(req as any).user?.role} no tiene permiso para realizar esta acción.`,
      });
      return;
    }
    next();
  };
};
export const requireAuth = protect;
export const authGuard = protect;
