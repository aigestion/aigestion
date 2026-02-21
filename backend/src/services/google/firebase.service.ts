import { injectable } from 'inversify';
import { logger } from '../../utils/logger';
import * as admin from 'firebase-admin';

/**
 * SOVEREIGN FIREBASE SERVICE
 * Orchestrates distributed state, real-time DB, and authentications.
 */
@injectable()
export class FirebaseService {
  private initialized = false;

  constructor() {
    this.initialize();
  }

  private initialize() {
    if (this.initialized) return;

    try {
      if (process.env.FIREBASE_CONFIG) {
        const config = JSON.parse(process.env.FIREBASE_CONFIG);
        admin.initializeApp({
          credential: admin.credential.cert(config),
          databaseURL: process.env.FIREBASE_DATABASE_URL,
        });
        this.initialized = true;
        logger.info('🔥 Sovereign Firebase Service Initialized.');
      } else {
        logger.warn('⚠️ FIREBASE_CONFIG missing. Firebase Service limited to local simulation.');
      }
    } catch (error) {
      logger.error('[FirebaseService] Initialization failed', error);
    }
  }

  /**
   * Syncs a sovereign user with Firebase Auth.
   */
  async syncUser(userId: string, email: string) {
    if (!this.initialized) return;
    logger.info(`[Firebase] Syncing user: ${userId}`);
    // Implementation for ensuring user exists in Firebase with custom claims
  }

  /**
   * Pushes real-time alerts to Firestore.
   */
  async pushAlert(userId: string, alert: any) {
    if (!this.initialized) {
      logger.debug('[Firebase] Simulated Alert Push:', alert);
      return;
    }
    await admin
      .firestore()
      .collection('users')
      .doc(userId)
      .collection('alerts')
      .add({
        ...alert,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      });
  }

  /**
   * 🔔 Sends an FCM push notification to a single device token.
   */
  async sendPushNotification(
    token: string,
    title: string,
    body: string,
    data?: Record<string, string>,
    channelId = 'nexus_default',
  ): Promise<string | null> {
    if (!this.initialized) {
      logger.debug('[Firebase] Simulated FCM push:', { title, body });
      return null;
    }
    try {
      const messageId = await admin.messaging().send({
        token,
        notification: { title, body },
        android: {
          priority: 'high',
          notification: { channelId, priority: 'max', defaultSound: true },
        },
        data: data || {},
      });
      logger.info({ messageId, title }, '[Firebase] 🔔 FCM push sent');
      return messageId;
    } catch (err) {
      logger.error(err, '[Firebase] FCM push failed');
      return null;
    }
  }

  /**
   * 🔔 Sends an FCM push to multiple device tokens.
   */
  async sendMulticastPush(
    tokens: string[],
    title: string,
    body: string,
    data?: Record<string, string>,
    channelId = 'nexus_default',
  ): Promise<number> {
    if (!this.initialized || tokens.length === 0) return 0;
    try {
      const response = await admin.messaging().sendEachForMulticast({
        tokens,
        notification: { title, body },
        android: {
          priority: 'high',
          notification: { channelId, priority: 'max', defaultSound: true },
        },
        data: data || {},
      });
      logger.info(
        { successCount: response.successCount, failureCount: response.failureCount, title },
        '[Firebase] 🔔 FCM multicast sent',
      );
      return response.successCount;
    } catch (err) {
      logger.error(err, '[Firebase] FCM multicast failed');
      return 0;
    }
  }
}
