const BOT_UA =
  /bot|crawler|spider|crawling|slurp|mediapartners|facebookexternalhit|ia_archiver|wget|curl|python|go-http|axios|libwww|scrapy|semrush|ahrefs|mj12bot|dotbot/i;

export function isBotUserAgent(userAgent: string) {
  return BOT_UA.test(userAgent);
}
