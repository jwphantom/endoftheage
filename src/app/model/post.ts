export interface Post {
  uid: string;
  title: string;
  content: string;
  img_url: string  | null;
  audio_url: string | null;
  video_url:  string | null;
  pdf_url:  string | null;
  create_date: string | null;
  timestamp:  number;
}