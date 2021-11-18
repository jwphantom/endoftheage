export interface Post {
  title: string;
  content: string;
  theme: string;
  type: string;
  img_url: string  | null;
  audio_url: string | null;
  video_url:  string | null;
  pdf_url:  string | null;
  create_date: string | null;
  timestamp:  number;
  likes : any[] | null;
  comments : any[] | null;
}


// comments : [{
//   uid : string | null,
//   pseudo: string | null,
//   comment: string | null,
//   create_date: string | null,
//   timestamp:  number | null,
// }];