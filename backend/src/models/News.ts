export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  url: string;
  source: string;
  publishedAt: string;
  category?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  content?: string;
  tags?: string[];
}
