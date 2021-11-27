export type ParsedBody = ParsedTextBody | ParsedImageBody;
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
