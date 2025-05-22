"use client"

import { HeroUIProvider, useDisclosure } from "@heroui/react";
import Editor from "./components/Editor/Editor";
import PageEditor from "./components/PageEditor";
import SaveLoadMenu from "./components/SaveLoadMenu";
import { DEFAULT_RESUME_STATE, LOCALSTORAGE_KEY, type Resume } from "./components/Types";
import { EditorContextProvider } from "./contexts/EditorContext";
import useLocalStorageState from "./hooks/useLocalStorageState";
import "./styles/layouts.css";

export default function Home(): React.ReactNode {

  const [ resumeState, setResumeState, ] = useLocalStorageState<Resume>(
    LOCALSTORAGE_KEY,
    DEFAULT_RESUME_STATE
  );
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <HeroUIProvider
      onKeyDown={(event: React.KeyboardEvent<HTMLDivElement>): void => {
        if ((event.ctrlKey || event.metaKey) && event.key === "s") {
          // Do not save webpage
          event.preventDefault();
          event.stopPropagation();
          
          // Show export modal
          onOpen();
        }
      }}
      tabIndex={ -1 }
    >
      <main className="flex-column items-center m-4 -mb-4">
        <EditorContextProvider>
          <SaveLoadMenu
            isOpen={ isOpen }
            onOpenChange={ onOpenChange }
            state={ resumeState }
            setState={ setResumeState }
          />
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
