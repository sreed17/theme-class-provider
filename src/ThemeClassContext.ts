import { createContext } from "react";
import { IThemeClassContext } from "./theme-class-provider.types";

const ThemeClassContext = createContext<IThemeClassContext | null>(null);

export default ThemeClassContext;
