import { OutgoingHttpHeaders } from 'http'
interface BodyText {
  type: 'text';
  data: string;
}
interface BodyImage {
  type: 'image';
  size?: {
    width: number;
    height: number;
  };
}
 type Body = BodyText | BodyImage;
 interface CORSPreflight {
  headers: OutgoingHttpHeaders;
  status?: number;
}
export interface Query {
  status?: number;
  headers?: OutgoingHttpHeaders;
  body?: Body;
  corsPreflight?: CORSPreflight
}
