"use client"

import { HeroUIProvider } from "@heroui/react";
import Editor from "./components/Editor/Editor";
import { EditorContextProvider } from "./contexts/EditorContext";
import PageEditor from "./components/PageEditor";
import { DEFAULT_RESUME_STATE, type Resume } from "./components/Types";
import useLocalStorageState from "./hooks/useLocalStorageState";
import "./styles/layouts.css";

export default function Home(): React.ReactNode {

  const [ resumeState, setResumeState, ] = useLocalStorageState<Resume>(
    "currentResume",
    DEFAULT_RESUME_STATE
  );

  return (
    <HeroUIProvider>
      <main className="flex-column items-center m-4 -mb-4">
        <EditorContextProvider>
          <PageEditor
            resume={ resumeState }
            setResumeState={ setResumeState }
          />
          <Editor />
        </EditorContextProvider>
      </main>
    </HeroUIProvider>
  );
}
