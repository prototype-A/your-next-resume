// Types
export type PaperSize = "a4" | "letter";
export type Resume = {
  size: PaperSize,
  pages: ResumePage[]
};
export type ResumePage = {
  items: ResumeItem[]
};
export type ResumeItem = {};


// Default values
export const DEFAULT_PAPER_SIZE: PaperSize = "letter";
export const DEFAULT_RESUME_PAGE: ResumePage = {
  items: []
};
export const DEFAULT_RESUME_STATE: Resume = {
  size: DEFAULT_PAPER_SIZE,
  pages: [ DEFAULT_RESUME_PAGE ]
};