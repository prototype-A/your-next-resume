import { useContext } from "react";
import ElementEditor from "./ElementEditor";
import { EditorContext } from "@/app/contexts/EditorContext";
import "@/app/styles/editors.css";

export default function Editor(): React.ReactNode {

  const { visible } = useContext(EditorContext);

  return (<>
    { visible &&
      <div className="editor">
        <ElementEditor />
      </div>
    }
  </>);
}