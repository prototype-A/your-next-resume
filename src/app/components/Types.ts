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
export const ResumeItemTypes = [
  "Education",
  "Employment",
  "Text"
] as const;
export type ResumeItemType = typeof ResumeItemTypes[number];
type ResumeItemDateRange = {
  startDate: string,
  endDate: string
};
export const ResumeItemTextContentTypes = [
  "Text",
  "List",
  "Tags",
] as const;
export type ResumeItemTextContentType = typeof ResumeItemTextContentTypes[number];
export type ResumeItem = {
  id: string,
  position: Coordinates,
  size: Dimensions
} & ({
  // Education
  content: {
    body: string[],
    degree: string,
    gpa: number,
    institution: string,
    location: string,
    major: string,
    minor: string
  } & ResumeItemDateRange,
  type: typeof ResumeItemTypes[0]
} | {
  // Employment
  content: {
    body: string[],
    company: string,
    location: string,
    position: string
  } & ResumeItemDateRange,
  type: typeof ResumeItemTypes[1]
} | {
  // Text
  content: {
    body: string,
    type: typeof ResumeItemTextContentTypes[0]
  } | {
    body: string[],
    type: typeof ResumeItemTextContentTypes[1] | typeof ResumeItemTextContentTypes[2]
  },
  type: typeof ResumeItemTypes[2]
});
export type EducationResumeItem = ResumeItem & {
  type: typeof ResumeItemTypes[0]
};
export type EmploymentResumeItem = ResumeItem & {
  type: typeof ResumeItemTypes[1]
};
export type TextResumeItem = ResumeItem & {
  type: typeof ResumeItemTypes[2]
};
export type MultiItemBodyTextResumeItem = TextResumeItem & {
  type: typeof ResumeItemTypes[2],
  content: {
    body: string[],
    type: typeof ResumeItemTextContentTypes[1] | typeof ResumeItemTextContentTypes[2]
  }
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
export type HasChildrenProp = {
  children?: React.ReactNode
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
export const DefaultResumeItemTextContentType = ResumeItemTextContentTypes[0];

export const DEFAULT_COORDINATES: Coordinates = {
  x: 0,
  y: 0
};
export const DEFAULT_DIMENSIONS: Dimensions = {
  height: 0,
  width: 0
};
export const ID_LENGTH: number = 8;
