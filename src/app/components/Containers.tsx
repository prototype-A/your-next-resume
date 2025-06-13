import type { HasChildrenProp, HasClassNameProp } from "./Types";
import "../styles/layouts.css";

type ContainerProps = HasChildrenProp & HasClassNameProp;

export const FlexRowDiv = ({
  children,
  className = ""
}: ContainerProps): React.ReactNode => (
  <div className={ "flex-row space-x-2 " + className }>
    { children }
  </div>
);

export const VSpacedDiv = ({
  children,
  className = ""
}: ContainerProps): React.ReactNode => (
  <div className={ "space-y-2 " + className }>
    { children }
  </div>
);