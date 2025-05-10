// Types
export type PaperSize = "a4" | "letter";
export type Resume = {
  size: PaperSize,
  pages: ResumePage[]
};
export type ResumePage = {
  id: string,
  items: ResumeItem[]
};
export type ResumeItemType = "Education" | "Employment" | "Text";
export type ResumeItem = {
  id: string,
  position: Coordinates,
  size: Dimensions,
  type: ResumeItemType
};

export type Coordinates = {
  x: number,
  y: number
};
export type Dimensions = {
  height: number,
  width: number
};

export type Ref<T> = React.RefObject<T | null>;
export type SetStateFn<T> = React.Dispatch<React.SetStateAction<T>>;
export type HasChildrenProps = {
  children: React.ReactNode
};


// Default values
export const DEFAULT_PAPER_SIZE: PaperSize = "letter";
export const DEFAULT_RESUME_PAGE: ResumePage = {
  id: "DefaultPage",
  items: []
};
export const DEFAULT_RESUME_STATE: Resume = {
  size: DEFAULT_PAPER_SIZE,
  pages: [ DEFAULT_RESUME_PAGE ]
};

export const DEFAULT_COORDINATES: Coordinates = {
  x: 0,
  y: 0
};
export const DEFAULT_DIMENSIONS: Dimensions = {
  height: 0,
  width: 0
};
