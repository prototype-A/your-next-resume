import type { HasChildrenProp } from "./Types";
import "../styles/layouts.css";

export const FlexRowDiv = ({
  children
}: HasChildrenProp): React.ReactNode => (
  <div className="flex-row space-x-2">
    { children }
  </div>
);

export const VSpacedDiv = ({
  children
}: HasChildrenProp): React.ReactNode => (
  <div className="space-y-2">
    { children }
  </div>
);