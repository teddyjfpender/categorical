export interface Module {
  title: string;
  slug: string;
  description: string;
  order: number;
  icon: string;
  prerequisites: string[];
}

export interface Lesson {
  title: string;
  module: string;
  order: number;
  description: string;
  slug: string;
}
