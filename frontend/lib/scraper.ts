import FirecrawlApp from '@mendable/firecrawl-js'

export type ScrapeResult = {
  title: string
  markdown: string
}

export async function scrapeArticle(url: string): Promise<ScrapeResult> {
  const app = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY! })

  const result = await app.scrape(url, { formats: ['markdown'] })

  return {
    title: (result as { title?: string }).title ?? url,
    markdown: (result as { markdown?: string }).markdown ?? '',
  }
}
