import { Card, CardBody } from "@heroui/react";
import { useContext } from "react";
import { EditorContext, type EditorState } from "@/app/contexts/EditorContext";
import ElementEditor from "./ElementEditor";
import FontEditor from "./FontEditor";
import "@/app/styles/editors.css";

export default function Editor(): React.ReactNode {

  const { visible } = useContext<EditorState>(EditorContext);

  return (<>{ visible &&
    <div className="editor">
      <Card
        className="editor-panel"
        radius="sm"
      >
        <CardBody>
          <FontEditor />
        </CardBody>
      </Card>
      <Card
        className="editor-panel"
        radius="sm"
      >
        <CardBody>
          <ElementEditor />
        </CardBody>
      </Card>
    </div>
  }</>);
}