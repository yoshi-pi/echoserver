import { OutgoingHttpHeaders } from 'http'
interface ParsedTextBody {
  type: 'text';
  data: string;
}
interface ParsedImageBody {
  type: 'image';
  size?: {
    width: number;
    height: number;
  };
}
export type ParsedBody = ParsedTextBody | ParsedImageBody;

export interface ParsedCORSPreflight {
  headers: OutgoingHttpHeaders;
  status?: number;
}
