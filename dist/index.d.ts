import { FC, PropsWithChildren } from 'react';

/**
 * @file theme-class-provider.types.ts
 * @description Defines all the types used in ThemeClassProvider lib.
 */
/**
 * Represents the state of the theme class context.
 */
interface IThemeClassState {
    /** The index of the previous theme class */
    previous: number | null;
    /** The index of the current theme class. */
    current: number;
    /** Array containing theme class names. */
    theme_classes: string[];
    /** Indicates whether the context is in a loading state. */
    is_loading: boolean;
    /** Holds any error that occurred within the context, or null if no error occurred. */
    error: Error | null;
    /** Indicates whether persisted theme data was loaded */
    loaded_persisted_data: boolean;
}
/**
 * Represents the data transfer object for persisting theme class state.
 */
type IThemePersistantDTO = Pick<IThemeClassState, "current" | "theme_classes">;
/**
 * Represents the context for managing theme classes.
 */
interface IThemeClassContext extends Pick<IThemeClassState, "is_loading" | "error" | "loaded_persisted_data"> {
    /** Loads the persisted theme state from the provided DTO. */
    loadState: (theme_dto: IThemePersistantDTO) => void;
    /** Toggles the theme class. */
    toggleTheme: () => void;
    /** Sets the current theme class. */
    setCurrentTheme: (theme_class: string) => void;
    /** Retrieves the name of the current theme class. */
    getCurrentTheme: () => string;
    /** Sets the theme classes to the provided array. */
    setThemeClasses: (classes: string[]) => void;
    /** Retrieves the list of theme classes. */
    getThemeClasses: () => string[];
    /** Clears the persisted theme data. */
    clearPersistedThemeData: () => void;
    /** Sets the default theme class. */
    setDefault: (theme_class: string) => void;
}
/**
 * Represents configuration options for persisting theme data.
 */
type IPersistanceConfiguration = {
    /** The key used for storing theme data. */
    key: string;
    /** Indicates whether persistence is disabled. */
    disabled: boolean;
    /** Clear the persisted data when the component unmounts */
    clearOnUnload: boolean;
};
/**
 * Represents partial configuration options for persisting theme data.
 */
type IPersistanceConfigurationProp = Partial<IPersistanceConfiguration>;
type IThemeChangeSideEffect = (current: IThemeClassState["current"], previous: IThemeClassState["previous"], class_list: IThemeClassState["theme_classes"]) => void;

/**
 * @file ThemeClassContextProvider.tsx
 * @description Provider component for managing theme class context.
 */

/**
 * Props for the ThemeClassContextProvider component.
 */
interface PropType extends PropsWithChildren {
    /** List of theme classes */
    themeClasses: string[];
    /** Configuration for persistance */
    persist?: IPersistanceConfigurationProp;
    /** On Theme changed  */
    onChange?: IThemeChangeSideEffect;
    /** set the default theme from the themeClasses, can be used to set default theme conditionaly*/
    defaultTheme?: string | null;
}
/**
 * ThemeClassContextProvider component.
 * Manages the theme class context and provides it to child components.
 */
declare const ThemeClassContextProvider: FC<PropType>;

/**
 * @file useThemeClassContext.ts
 * @description React hook for accessing the theme class context
 */
/**
 * A custom hook for accessing the theme class context.
 * @returns The theme class context.
 * @throws An error if the theme class context is null.
 */
declare const useThemeClassContext: () => IThemeClassContext;

export { ThemeClassContextProvider as ThemeClassProvider, useThemeClassContext as useThemeClass };
