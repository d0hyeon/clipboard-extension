
export interface ClipboardData {
  id: string;
  text: string;
  meta: {
    url: string;
    title: string;
  }
}

export interface TabData {
  active: boolean;
}

