/**
 * @file useThemeClassContext.ts
 * @description React hook for accessing the theme class context
 */

import { useContext } from "react";
import ThemeClassContext from "./ThemeClassContext";

/**
 * A custom hook for accessing the theme class context.
 * @returns The theme class context.
 * @throws An error if the theme class context is null.
 */
const useThemeClassContext = () => {
    const context = useContext(ThemeClassContext);
    if (!context)
        throw new Error(
            "Error: Theme-class-context is null. Make sure the you are using the ThemeClassProvider correctly."
        );
    return context;
};

export default useThemeClassContext;
