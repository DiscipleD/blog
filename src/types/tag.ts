import { PostShort } from './post';

export interface TagShort {
  name: string,
  label: string
}

export default class Tag {
  id: number;
  name: string;
  createdDate: string;
  label: string;
}

export interface TagPage extends Tag {
  posts: PostShort[]
}
