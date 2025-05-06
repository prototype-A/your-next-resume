"use client"

import { HeroUIProvider } from "@heroui/react";
import { useState } from "react";
import { DEFAULT_RESUME_STATE, Resume } from "./components/Types";
import PageEditor from "./components/PageEditor";
import "./styles/layouts.css";

export default function Home() {

  const [ resumeState, setResumeState ] = useState<Resume>(DEFAULT_RESUME_STATE);

  return (
    <HeroUIProvider>
      <main className="flex-col items-center">
        <PageEditor
          resume={ resumeState }
          setResumeState={ setResumeState }
        />
      </main>
    </HeroUIProvider>
  );
}
