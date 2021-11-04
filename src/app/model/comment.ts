export interface Comment {
    uid: string;
    postId: string;
    pseudo: string;
    comment: string;
    create_date: string | null;
    timestamp:  number;
  }