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
export const HAlignTypes = [
  "left",
  "center",
  "right",
  "justify"
] as const;
export type HAlign = typeof HAlignTypes[number];
export type TextFormatting = {
  font: string,
  hAlign: HAlign,
  size: number,
  style: string
};
export type Text = {
  text: string
} & TextFormatting;
export type TextList = {
  text: string[]
} & TextFormatting;
export const RESUME_ITEM_TYPES = [
  "Education",
  "Employment",
  "Text"
] as const;
export type ResumeItemType = typeof RESUME_ITEM_TYPES[number];
type ResumeItemDateRange = {
  startDate: string,
  endDate: string
} & TextFormatting;
export const RESUME_ITEM_TEXT_CONTENT_TYPES = [
  "Text",
  "List",
  "Tags",
] as const;
export type ResumeItemTextContentType = typeof RESUME_ITEM_TEXT_CONTENT_TYPES[number];
export type ResumeItem = {
  id: string,
  position: Coordinates,
  size: Dimensions
} & ({
  // Education
  content: {
    body: TextList,
    degree: Text,
    gpa: Text,
    institution: Text,
    location: Text,
    major: Text,
    minor: Text,
    period: ResumeItemDateRange
  },
  type: typeof RESUME_ITEM_TYPES[0]
} | {
  // Employment
  content: {
    body: TextList,
    company: Text,
    location: Text,
    period: ResumeItemDateRange,
    position: Text
  },
  type: typeof RESUME_ITEM_TYPES[1]
} | {
  // Text
  content: {
    body: Text,
    type: typeof RESUME_ITEM_TEXT_CONTENT_TYPES[0]
  } | {
    body: TextList,
    type: typeof RESUME_ITEM_TEXT_CONTENT_TYPES[1] | typeof RESUME_ITEM_TEXT_CONTENT_TYPES[2]
  },
  header: Text,
  type: typeof RESUME_ITEM_TYPES[2]
});
export type EducationResumeItem = ResumeItem & {
  type: typeof RESUME_ITEM_TYPES[0]
};
export type EmploymentResumeItem = ResumeItem & {
  type: typeof RESUME_ITEM_TYPES[1]
};
export type TextResumeItem = ResumeItem & {
  content: {
    type: typeof RESUME_ITEM_TEXT_CONTENT_TYPES[0]
  },
  type: typeof RESUME_ITEM_TYPES[2]
};
export type MultiItemBodyTextResumeItem = ResumeItem & {
  content: {
    type: typeof RESUME_ITEM_TEXT_CONTENT_TYPES[1] | typeof RESUME_ITEM_TEXT_CONTENT_TYPES[2]
  },
  type: typeof RESUME_ITEM_TYPES[2]
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
export type HasClassNameProp = {
  className?: string
};


// Default values
export const LOCALSTORAGE_KEY: string = "currentResume";
export const DEFAULT_PAPER_SIZE: PaperSize = "letter";
export const DEFAULT_RESUME_PAGE: ResumePage = {
  id: "DefaultPage",
  items: []
};
export const DEFAULT_RESUME_STATE: Resume = {
  size: DEFAULT_PAPER_SIZE,
  pages: [ DEFAULT_RESUME_PAGE ]
};
export const DEFAULT_TEXT_CONTENT_TYPE: ResumeItemTextContentType = RESUME_ITEM_TEXT_CONTENT_TYPES[0];

export const DEFAULT_FONT_LIST: string[] = [
  "Roboto"
];
export const DEFAULT_FONT: string = DEFAULT_FONT_LIST[0];
export const DEFAULT_FONT_SIZE: number = 20;
export const DEFAULT_TEXT_H_ALIGN: HAlign = HAlignTypes[1];
export const DEFAULT_TEXT_FORMATTING: TextFormatting = {
  font: DEFAULT_FONT,
  hAlign: DEFAULT_TEXT_H_ALIGN,
  size: DEFAULT_FONT_SIZE,
  style: ""
};
export const DEFAULT_TEXT: Text = {
  ...DEFAULT_TEXT_FORMATTING,
  text: ""
};
export const DEFAULT_TEXT_LIST: TextList = {
  ...DEFAULT_TEXT_FORMATTING,
  text: []
};
export const DEFAULT_PERIOD: ResumeItemDateRange = {
  ...DEFAULT_TEXT_FORMATTING,
  endDate: "",
  startDate: ""
};
export const DEFAULT_GPA: Text = {
  ...DEFAULT_TEXT_FORMATTING,
  text: "0.0"
};

export const DEFAULT_COORDINATES: Coordinates = {
  x: 0,
  y: 0
};
export const DEFAULT_DIMENSIONS: Dimensions = {
  height: 0,
  width: 0
};
export const ID_LENGTH: number = 8;
