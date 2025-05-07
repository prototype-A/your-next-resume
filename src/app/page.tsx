"use client"

import { HeroUIProvider } from "@heroui/react";
import { DEFAULT_RESUME_STATE, type Resume } from "./components/Types";
import PageEditor from "./components/PageEditor";
import useLocalStorageState from "./hooks/useLocalStorageState";
import "./styles/layouts.css";

export default function Home() {

  const [ resumeState, setResumeState, ] = useLocalStorageState<Resume>(
    "currentResume",
    DEFAULT_RESUME_STATE
  );

  return (
    <HeroUIProvider>
      <main className="flex-column items-center m-4 -mb-4">
        <PageEditor
          resume={ resumeState }
          setResumeState={ setResumeState }
        />
      </main>
    </HeroUIProvider>
  );
}
