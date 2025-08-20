import { ResumeItemDateRange, Text } from "../components/Types";
import { optionalPrefix } from "./StringUtils";

/**
 * Returns the GPA value prepended with "GPA: "
 * if it is not empty or 0(.0).
 * 
 * @param gpa - The GPA text with its formatting.
 * @returns The formatted GPA text.
 */
export function formatGPAText(gpa: Text): string {
  return gpa.text !== "" && gpa.text !== "0" && gpa.text !== "0.0"
    ? `GPA: ${gpa.text}`
    : ""
}

/**
 * Returns only the start date if it is not empty and the end date isn't
 * specified, or "start date - end date" if both are populated.
 * 
 * @param period - The duration period with its formatting.
 * @returns The formatted period text.
 */
export function formatPeriodText(period: ResumeItemDateRange): string {
  return period.startDate + optionalPrefix(" - ", period.endDate);
}