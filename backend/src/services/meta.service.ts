import axios, { AxiosError } from 'axios';
import { injectable } from 'inversify';
import { env } from '../config/env.schema';
import { logger } from '../utils/logger';

// ═══════════════════════════════════════════════════════════════
// AIGestion Nexus — Meta Unified Service (God Mode)
// Facebook Pages + Instagram Business + WhatsApp Cloud API
// Graph API v21.0
// ═══════════════════════════════════════════════════════════════

const GRAPH_API_VERSION = 'v21.0';
const GRAPH_BASE_URL = `https://graph.facebook.com/${GRAPH_API_VERSION}`;

interface MetaApiError {
  message: string;
  type: string;
  code: number;
  error_subcode?: number;
  fbtrace_id?: string;
}

interface PostResult {
  id: string;
  post_id?: string;
}

interface InsightsResult {
  data: Array<{
    name: string;
    period: string;
    values: Array<{ value: number; end_time: string }>;
    title: string;
    description: string;
  }>;
}

interface WhatsAppMessageResult {
  messaging_product: string;
  contacts: Array<{ input: string; wa_id: string }>;
  messages: Array<{ id: string }>;
}

@injectable()
export class MetaService {
  // ─── Token Management ──────────────────────────────────────
  private get metaToken(): string {
    return env.META_ACCESS_TOKEN || '';
  }

  private get facebookPageToken(): string {
    return env.FACEBOOK_PAGE_ACCESS_TOKEN || this.metaToken;
  }

  private get facebookPageId(): string {
    return env.FACEBOOK_PAGE_ID || '';
  }

  private get instagramToken(): string {
    return env.INSTAGRAM_ACCESS_TOKEN || this.metaToken;
  }

  private get instagramBusinessId(): string {
    return env.INSTAGRAM_BUSINESS_ID || '';
  }

  private get instagramAccountId(): string {
    return env.INSTAGRAM_BUSINESS_ACCOUNT_ID || '';
  }

  private get whatsappToken(): string {
    return env.WHATSAPP_TOKEN || this.metaToken;
  }

  private get whatsappPhoneId(): string {
    return env.WHATSAPP_BUSINESS_PHONE_ID || '';
  }

  // ─── Helpers ───────────────────────────────────────────────
  private handleError(context: string, error: unknown): void {
    if (axios.isAxiosError(error)) {
      const axErr = error as AxiosError<{ error: MetaApiError }>;
      const metaErr = axErr.response?.data?.error;
      logger.error(
        {
          context,
          status: axErr.response?.status,
          metaCode: metaErr?.code,
          metaSubcode: metaErr?.error_subcode,
          metaType: metaErr?.type,
          message: metaErr?.message || axErr.message,
          fbtrace: metaErr?.fbtrace_id,
        },
        `🔴 Meta API Error — ${context}`,
      );
    } else {
      logger.error({ context, error }, `🔴 Meta Error — ${context}`);
    }
  }

  private ensureToken(token: string, name: string): void {
    if (!token) {
      throw new Error(`Meta ${name} not configured. Set it in .env`);
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // FACEBOOK PAGE
  // ═══════════════════════════════════════════════════════════════

  /**
   * Post a message to the connected Facebook Page.
   */
  async facebookPublish(message: string, link?: string): Promise<PostResult | null> {
    this.ensureToken(this.facebookPageToken, 'FACEBOOK_PAGE_ACCESS_TOKEN');
    this.ensureToken(this.facebookPageId, 'FACEBOOK_PAGE_ID');

    try {
      const payload: Record<string, string> = { message };
      if (link) payload.link = link;

      const { data } = await axios.post<PostResult>(
        `${GRAPH_BASE_URL}/${this.facebookPageId}/feed`,
        payload,
        { params: { access_token: this.facebookPageToken } },
      );

      logger.info({ postId: data.id }, '🟢 Facebook Page Post — Published');
      return data;
    } catch (error) {
      this.handleError('facebookPublish', error);
      return null;
    }
  }

  /**
   * Post a photo with caption to the Facebook Page.
   */
  async facebookPublishPhoto(photoUrl: string, caption?: string): Promise<PostResult | null> {
    this.ensureToken(this.facebookPageToken, 'FACEBOOK_PAGE_ACCESS_TOKEN');
    this.ensureToken(this.facebookPageId, 'FACEBOOK_PAGE_ID');

    try {
      const { data } = await axios.post<PostResult>(
        `${GRAPH_BASE_URL}/${this.facebookPageId}/photos`,
        { url: photoUrl, caption: caption || '' },
        { params: { access_token: this.facebookPageToken } },
      );

      logger.info({ postId: data.id }, '🟢 Facebook Photo — Published');
      return data;
    } catch (error) {
      this.handleError('facebookPublishPhoto', error);
      return null;
    }
  }

  /**
   * Get Facebook Page insights.
   */
  async facebookInsights(
    metrics = 'page_impressions,page_engaged_users,page_fans',
    period = 'day',
  ): Promise<InsightsResult | null> {
    this.ensureToken(this.facebookPageToken, 'FACEBOOK_PAGE_ACCESS_TOKEN');
    this.ensureToken(this.facebookPageId, 'FACEBOOK_PAGE_ID');

    try {
      const { data } = await axios.get<InsightsResult>(
        `${GRAPH_BASE_URL}/${this.facebookPageId}/insights`,
        {
          params: {
            metric: metrics,
            period,
            access_token: this.facebookPageToken,
          },
        },
      );
      return data;
    } catch (error) {
      this.handleError('facebookInsights', error);
      return null;
    }
  }

  /**
   * Get comments on a specific post.
   */
  async facebookGetComments(postId: string): Promise<any> {
    this.ensureToken(this.facebookPageToken, 'FACEBOOK_PAGE_ACCESS_TOKEN');

    try {
      const { data } = await axios.get(`${GRAPH_BASE_URL}/${postId}/comments`, {
        params: { access_token: this.facebookPageToken },
      });
      return data;
    } catch (error) {
      this.handleError('facebookGetComments', error);
      return null;
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // INSTAGRAM BUSINESS
  // ═══════════════════════════════════════════════════════════════

  /**
   * Publish a photo to Instagram Business.
   * Two-step process: create media container → publish.
   */
  async instagramPublishPhoto(imageUrl: string, caption: string): Promise<PostResult | null> {
    this.ensureToken(this.instagramToken, 'INSTAGRAM_ACCESS_TOKEN');
    this.ensureToken(this.instagramAccountId, 'INSTAGRAM_BUSINESS_ACCOUNT_ID');

    try {
      // Step 1: Create media container
      const { data: container } = await axios.post(
        `${GRAPH_BASE_URL}/${this.instagramAccountId}/media`,
        { image_url: imageUrl, caption },
        { params: { access_token: this.instagramToken } },
      );

      // Step 2: Publish the container
      const { data: post } = await axios.post<PostResult>(
        `${GRAPH_BASE_URL}/${this.instagramAccountId}/media_publish`,
        { creation_id: container.id },
        { params: { access_token: this.instagramToken } },
      );

      logger.info({ postId: post.id }, '🟢 Instagram Photo — Published');
      return post;
    } catch (error) {
      this.handleError('instagramPublishPhoto', error);
      return null;
    }
  }

  /**
   * Publish a carousel (multiple images) to Instagram.
   */
  async instagramPublishCarousel(
    imageUrls: string[],
    caption: string,
  ): Promise<PostResult | null> {
    this.ensureToken(this.instagramToken, 'INSTAGRAM_ACCESS_TOKEN');
    this.ensureToken(this.instagramAccountId, 'INSTAGRAM_BUSINESS_ACCOUNT_ID');

    try {
      // Step 1: Create individual containers for each image
      const containerIds: string[] = [];
      for (const url of imageUrls) {
        const { data } = await axios.post(
          `${GRAPH_BASE_URL}/${this.instagramAccountId}/media`,
          { image_url: url, is_carousel_item: true },
          { params: { access_token: this.instagramToken } },
        );
        containerIds.push(data.id);
      }

      // Step 2: Create carousel container
      const { data: carousel } = await axios.post(
        `${GRAPH_BASE_URL}/${this.instagramAccountId}/media`,
        { media_type: 'CAROUSEL', children: containerIds, caption },
        { params: { access_token: this.instagramToken } },
      );

      // Step 3: Publish
      const { data: post } = await axios.post<PostResult>(
        `${GRAPH_BASE_URL}/${this.instagramAccountId}/media_publish`,
        { creation_id: carousel.id },
        { params: { access_token: this.instagramToken } },
      );

      logger.info({ postId: post.id, images: imageUrls.length }, '🟢 Instagram Carousel — Published');
      return post;
    } catch (error) {
      this.handleError('instagramPublishCarousel', error);
      return null;
    }
  }

  /**
   * Get Instagram Business Account insights.
   */
  async instagramInsights(
    metrics = 'impressions,reach,profile_views',
    period = 'day',
  ): Promise<InsightsResult | null> {
    this.ensureToken(this.instagramToken, 'INSTAGRAM_ACCESS_TOKEN');
    this.ensureToken(this.instagramAccountId, 'INSTAGRAM_BUSINESS_ACCOUNT_ID');

    try {
      const { data } = await axios.get<InsightsResult>(
        `${GRAPH_BASE_URL}/${this.instagramAccountId}/insights`,
        {
          params: {
            metric: metrics,
            period,
            access_token: this.instagramToken,
          },
        },
      );
      return data;
    } catch (error) {
      this.handleError('instagramInsights', error);
      return null;
    }
  }

  /**
   * Get recent Instagram media.
   */
  async instagramGetMedia(limit = 12): Promise<any> {
    this.ensureToken(this.instagramToken, 'INSTAGRAM_ACCESS_TOKEN');
    this.ensureToken(this.instagramAccountId, 'INSTAGRAM_BUSINESS_ACCOUNT_ID');

    try {
      const { data } = await axios.get(
        `${GRAPH_BASE_URL}/${this.instagramAccountId}/media`,
        {
          params: {
            fields: 'id,caption,media_type,media_url,thumbnail_url,timestamp,like_count,comments_count',
            limit,
            access_token: this.instagramToken,
          },
        },
      );
      return data;
    } catch (error) {
      this.handleError('instagramGetMedia', error);
      return null;
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // WHATSAPP CLOUD API
  // ═══════════════════════════════════════════════════════════════

  /**
   * Send a WhatsApp text message.
   */
  async whatsappSendMessage(to: string, body: string): Promise<WhatsAppMessageResult | null> {
    this.ensureToken(this.whatsappToken, 'WHATSAPP_TOKEN');
    this.ensureToken(this.whatsappPhoneId, 'WHATSAPP_BUSINESS_PHONE_ID');

    try {
      const { data } = await axios.post<WhatsAppMessageResult>(
        `${GRAPH_BASE_URL}/${this.whatsappPhoneId}/messages`,
        {
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: to.replace(/[^0-9]/g, ''),
          type: 'text',
          text: { preview_url: false, body },
        },
        {
          headers: {
            Authorization: `Bearer ${this.whatsappToken}`,
            'Content-Type': 'application/json',
          },
        },
      );

      logger.info({ to, messageId: data.messages?.[0]?.id }, '🟢 WhatsApp Message — Sent');
      return data;
    } catch (error) {
      this.handleError('whatsappSendMessage', error);
      return null;
    }
  }

  /**
   * Send a WhatsApp template message.
   */
  async whatsappSendTemplate(
    to: string,
    templateName: string,
    languageCode = 'es',
  ): Promise<WhatsAppMessageResult | null> {
    this.ensureToken(this.whatsappToken, 'WHATSAPP_TOKEN');
    this.ensureToken(this.whatsappPhoneId, 'WHATSAPP_BUSINESS_PHONE_ID');

    try {
      const { data } = await axios.post<WhatsAppMessageResult>(
        `${GRAPH_BASE_URL}/${this.whatsappPhoneId}/messages`,
        {
          messaging_product: 'whatsapp',
          to: to.replace(/[^0-9]/g, ''),
          type: 'template',
          template: {
            name: templateName,
            language: { code: languageCode },
          },
        },
        {
          headers: {
            Authorization: `Bearer ${this.whatsappToken}`,
            'Content-Type': 'application/json',
          },
        },
      );

      logger.info({ to, template: templateName }, '🟢 WhatsApp Template — Sent');
      return data;
    } catch (error) {
      this.handleError('whatsappSendTemplate', error);
      return null;
    }
  }

  /**
   * Send a WhatsApp media message (image, document, etc.).
   */
  async whatsappSendMedia(
    to: string,
    mediaType: 'image' | 'document' | 'video' | 'audio',
    mediaUrl: string,
    caption?: string,
  ): Promise<WhatsAppMessageResult | null> {
    this.ensureToken(this.whatsappToken, 'WHATSAPP_TOKEN');
    this.ensureToken(this.whatsappPhoneId, 'WHATSAPP_BUSINESS_PHONE_ID');

    try {
      const mediaPayload: Record<string, string> = { link: mediaUrl };
      if (caption) mediaPayload.caption = caption;

      const { data } = await axios.post<WhatsAppMessageResult>(
        `${GRAPH_BASE_URL}/${this.whatsappPhoneId}/messages`,
        {
          messaging_product: 'whatsapp',
          to: to.replace(/[^0-9]/g, ''),
          type: mediaType,
          [mediaType]: mediaPayload,
        },
        {
          headers: {
            Authorization: `Bearer ${this.whatsappToken}`,
            'Content-Type': 'application/json',
          },
        },
      );

      logger.info({ to, mediaType }, '🟢 WhatsApp Media — Sent');
      return data;
    } catch (error) {
      this.handleError('whatsappSendMedia', error);
      return null;
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // CROSS-PLATFORM STATUS
  // ═══════════════════════════════════════════════════════════════

  /**
   * Get the configuration and connection status of all Meta platforms.
   */
  async getStatus(): Promise<{
    facebook: { configured: boolean; pageId: string };
    instagram: { configured: boolean; accountId: string };
    whatsapp: { configured: boolean; phoneId: string };
  }> {
    return {
      facebook: {
        configured: !!(this.facebookPageToken && this.facebookPageId),
        pageId: this.facebookPageId || 'NOT_CONFIGURED',
      },
      instagram: {
        configured: !!(this.instagramToken && this.instagramAccountId),
        accountId: this.instagramAccountId || 'NOT_CONFIGURED',
      },
      whatsapp: {
        configured: !!(this.whatsappToken && this.whatsappPhoneId),
        phoneId: this.whatsappPhoneId || 'NOT_CONFIGURED',
      },
    };
  }

  /**
   * Verify all platform connections by making test API calls.
   */
  async verifyConnections(): Promise<Record<string, boolean>> {
    const results: Record<string, boolean> = {
      facebook: false,
      instagram: false,
      whatsapp: false,
    };

    // Facebook
    if (this.facebookPageToken && this.facebookPageId) {
      try {
        await axios.get(`${GRAPH_BASE_URL}/${this.facebookPageId}`, {
          params: { fields: 'id,name', access_token: this.facebookPageToken },
        });
        results.facebook = true;
        logger.info('🟢 Facebook Page — Connection verified');
      } catch {
        logger.warn('🔴 Facebook Page — Connection FAILED');
      }
    }

    // Instagram
    if (this.instagramToken && this.instagramAccountId) {
      try {
        await axios.get(`${GRAPH_BASE_URL}/${this.instagramAccountId}`, {
          params: { fields: 'id,username', access_token: this.instagramToken },
        });
        results.instagram = true;
        logger.info('🟢 Instagram Business — Connection verified');
      } catch {
        logger.warn('🔴 Instagram Business — Connection FAILED');
      }
    }

    // WhatsApp
    if (this.whatsappToken && this.whatsappPhoneId) {
      try {
        await axios.get(`${GRAPH_BASE_URL}/${this.whatsappPhoneId}`, {
          headers: { Authorization: `Bearer ${this.whatsappToken}` },
        });
        results.whatsapp = true;
        logger.info('🟢 WhatsApp Business — Connection verified');
      } catch {
        logger.warn('🔴 WhatsApp Business — Connection FAILED');
      }
    }

    return results;
  }
}
