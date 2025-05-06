
import { DEFAULT_RESUME_PAGE, PaperSize, Resume, ResumePage } from "./Types";
import { removeAtIndex } from "../utils/ArrayUtils";
import { Button } from "@heroui/react";
import "../styles/layouts.css";
import "../styles/page.css";

type PageProps = {
  size: PaperSize
};

function Page({ size }: PageProps): React.ReactNode {
  return (
    <div
      className={ "page " + (size === "a4"
        ? "page-a4"
        : "page-letter"
      )}
    >
    </div>
  );
}

type PageEditorProps = {
  resume: Resume,
  setResumeState: React.Dispatch<React.SetStateAction<Resume>>
}

export default function PageEditor({ resume, setResumeState }: PageEditorProps): React.ReactNode {
  return (
    <div
      className={ "flex-col justify-center w-full " + (resume.size === "a4"
        ? "max-w-(--a4-width)"
        : "max-w-(--letter-width)"
      )}
    >
      {resume.pages.map((_: ResumePage, idx: number): React.ReactNode => (
        <div key={ `page${idx}` }>
          { /* Remove page button */ }
          { idx >= 1 &&
            <Button
              className="button"
              onPress={(): void => {
                // Delete page
                setResumeState({
                  size: resume.size,
                  pages: removeAtIndex(resume.pages, idx)
                });
              }}
              radius="sm"
            >
              { "-" }
            </Button>
          }
          <Page size={ resume.size }></Page>
        </div>
      ))}
      { /* Add page button */ }
      <Button
        className="button"
        onPress={(): void => {
          // Add a new page
          setResumeState({
            size: resume.size,
            pages: [ ...resume.pages, DEFAULT_RESUME_PAGE ]
          });
        }}
        radius="sm"
      >
        { "+" }
      </Button>
    </div>
  );
};
