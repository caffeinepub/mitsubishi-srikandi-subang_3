// Visitor tracking utility functions

export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

export function getOrCreateSessionId(): string {
  const storageKey = 'visitor_session_id';
  
  // Try to get existing session ID from sessionStorage
  let sessionId = sessionStorage.getItem(storageKey);
  
  if (!sessionId) {
    // Generate new session ID if none exists
    sessionId = generateSessionId();
    sessionStorage.setItem(storageKey, sessionId);
  }
  
  return sessionId;
}

export function detectDeviceType(): string {
  const ua = navigator.userAgent.toLowerCase();
  
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }
  if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile|wpdesktop/i.test(ua)) {
    return 'mobile';
  }
  return 'desktop';
}

export function detectBrowser(): string {
  const ua = navigator.userAgent;
  
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Edg')) return 'Edge';
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
  if (ua.includes('Opera') || ua.includes('OPR')) return 'Opera';
  if (ua.includes('Trident') || ua.includes('MSIE')) return 'Internet Explorer';
  
  return 'Unknown';
}

export function isBot(): boolean {
  const ua = navigator.userAgent.toLowerCase();
  const botPatterns = [
    'bot', 'crawler', 'spider', 'scraper', 'slurp', 'bingbot', 
    'googlebot', 'yandexbot', 'baiduspider', 'facebookexternalhit',
    'twitterbot', 'rogerbot', 'linkedinbot', 'embedly', 'quora link preview',
    'showyoubot', 'outbrain', 'pinterest', 'slackbot', 'vkshare',
    'w3c_validator', 'redditbot', 'applebot', 'whatsapp', 'flipboard',
    'tumblr', 'bitlybot', 'skypeuripreview', 'nuzzel', 'discordbot',
    'qwantify', 'pinterestbot', 'bitrix link preview', 'xing-contenttabreceiver',
    'chrome-lighthouse', 'telegrambot'
  ];
  
  return botPatterns.some(pattern => ua.includes(pattern));
}

export function isAdminRoute(pathname: string): boolean {
  return pathname.startsWith('/admin') || pathname.startsWith('/login');
}

export function getClientIP(): string {
  // In browser environment, we cannot directly get the real IP address
  // This would need to be done server-side or via a service
  // For now, return a placeholder that indicates client-side detection
  return 'client-detected';
}
