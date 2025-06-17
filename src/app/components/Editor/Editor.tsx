import { useContext } from "react";
import ElementEditor from "./ElementEditor";
import FontEditor from "./FontEditor";
import { EditorContext, type EditorState } from "@/app/contexts/EditorContext";
import "@/app/styles/editors.css";

export default function Editor(): React.ReactNode {

  const { visible } = useContext<EditorState>(EditorContext);

  return (<>
    { visible &&
      <div className="editor">
        <FontEditor />
        <ElementEditor />
      </div>
    }
  </>);
}