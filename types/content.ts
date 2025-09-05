export interface ContentItem {
  note_id: string;
  type: string;
  title: string;
  desc: string;
  video_url?: string;
  time: number;
  last_update_time: number;
  user_id: string;
  nickname: string;
  avatar: string;
  liked_count: string;
  collected_count: string;
  comment_count: string;
  share_count: string;
  ip_location: string;
  image_list: string;
  tag_list: string;
  last_modify_ts: number;
  note_url: string;
  source_keyword: string;
  xsec_token: string;
}

export interface ContentCardProps {
  content: ContentItem;
  onLike?: () => void;
  onCollect?: () => void;
  onCardClick?: (noteUrl: string) => void;
  isLiked?: boolean;
  isCollected?: boolean;
}
