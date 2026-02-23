import { Router, Request, Response } from 'express';
import * as https from 'node:https';
import { logger } from '../utils/logger';

const router = Router();

/**
 * GET /api/auth/notion/callback
 * 
 * Handles the OAuth redirect from Notion.
 * Exchanges the authorization code for an access token.
 */
router.get('/callback', async (req: Request, res: Response) => {
  const { code, state, error } = req.query;

  if (error) {
    logger.error(`[NotionOAuth] Authorization denied: ${error}`);
    return res.redirect(`${process.env.FRONTEND_URL || 'https://aigestion.net'}/?notion_error=${error}`);
  }

  if (!code || typeof code !== 'string') {
    logger.error('[NotionOAuth] No authorization code received');
    return res.redirect(`${process.env.FRONTEND_URL || 'https://aigestion.net'}/?notion_error=no_code`);
  }

  const clientId = process.env.NOTION_OAUTH_CLIENT_ID;
  const clientSecret = process.env.NOTION_OAUTH_CLIENT_SECRET;
  const redirectUri = process.env.NOTION_OAUTH_REDIRECT_URI || 'https://aigestion.net/api/auth/notion/callback';

  if (!clientId || !clientSecret) {
    logger.error('[NotionOAuth] Missing NOTION_OAUTH_CLIENT_ID or NOTION_OAUTH_CLIENT_SECRET');
    return res.redirect(`${process.env.FRONTEND_URL || 'https://aigestion.net'}/?notion_error=config_error`);
  }

  try {
    // Exchange code for access token
    const tokenResponse = await exchangeCodeForToken(code, clientId, clientSecret, redirectUri);

    if (tokenResponse.error) {
      logger.error(`[NotionOAuth] Token exchange failed: ${tokenResponse.error}`);
      return res.redirect(`${process.env.FRONTEND_URL || 'https://aigestion.net'}/?notion_error=token_exchange_failed`);
    }

    logger.info(`[NotionOAuth] ✅ Token obtained for workspace: ${tokenResponse.workspace_name}`);

    // TODO: Store the access_token, workspace_id, bot_id in the database
    // For now, redirect with success
    const frontendUrl = process.env.FRONTEND_URL || 'https://aigestion.net';
    return res.redirect(`${frontendUrl}/dashboard?notion_connected=true&workspace=${encodeURIComponent(tokenResponse.workspace_name || '')}`);

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    logger.error(`[NotionOAuth] Exchange error: ${msg}`);
    return res.redirect(`${process.env.FRONTEND_URL || 'https://aigestion.net'}/?notion_error=exchange_error`);
  }
});

/**
 * Exchange authorization code for access token via Notion's token endpoint.
 */
function exchangeCodeForToken(
  code: string,
  clientId: string,
  clientSecret: string,
  redirectUri: string,
): Promise<any> {
  return new Promise((resolve, reject) => {
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const body = JSON.stringify({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
    });

    const options = {
      hostname: 'api.notion.com',
      path: '/v1/oauth/token',
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
      },
    };

    const req = https.request(options, (res: any) => {
      let data = '';
      res.on('data', (chunk: any) => (data += chunk));
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch {
          reject(new Error(`Failed to parse Notion response: ${data}`));
        }
      });
    });

    req.on('error', (err: Error) => reject(err));
    req.write(body);
    req.end();
  });
}

export default router;
