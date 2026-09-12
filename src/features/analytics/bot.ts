const BOT_UA =
  /bot|crawler|spider|crawling|slurp|mediapartners|facebookexternalhit|ia_archiver|wget|curl|python|go-http|axios|libwww|scrapy|semrush|ahrefs|mj12bot|dotbot|headless|lighthouse|pagespeed|whatsapp|node-fetch|undici|okhttp|java\/|postman|phantomjs|selenium|puppeteer|playwright|uptime|monitor|pingdom|preview/i;

export function isBotUserAgent(userAgent: string) {
  return !userAgent.trim() || BOT_UA.test(userAgent);
}
