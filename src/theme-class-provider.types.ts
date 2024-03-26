/**
 * @file theme-class-provider.types.ts
 * @description Defines all the types used in ThemeClassProvider lib.
 */

/**
 * Represents the state of the theme class context.
 */
export interface IThemeClassState {
    /** The index of the current theme class. */
    current: number;
    /** Array containing theme class names. */
    theme_classes: string[];
    /** Indicates whether the context is in a loading state. */
    is_loading: boolean;
    /** Holds any error that occurred within the context, or null if no error occurred. */
    error: Error | null;
}

/**
 * Represents the data transfer object for persisting theme class state.
 */
export type IThemePersistantDTO = Pick<
    IThemeClassState,
    "current" | "theme_classes"
>;

/**
 * Represents the context for managing theme classes.
 */
export interface IThemeClassContext
    extends Pick<IThemeClassState, "is_loading" | "error"> {
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
 * List of possible actions for theme class context.
 */
export const THEME_CLASS_ACTIONS = [
    "SET_LOADING_STATE",
    "SET_THEME_CLASSES",
    "SET_CURRENT_THEME_CLASS",
    "TOGGLE_THEME",
    "LOAD_STATE",
    "SET_DEFAULT",
] as const;

/**
 * Represents an action that can be dispatched to the theme class reducer.
 */
export type IThemeClassAction =
    | { type: (typeof THEME_CLASS_ACTIONS)[0]; payload: boolean }
    | { type: (typeof THEME_CLASS_ACTIONS)[1]; payload: string[] }
    | { type: (typeof THEME_CLASS_ACTIONS)[2]; payload: string }
    | { type: (typeof THEME_CLASS_ACTIONS)[3]; payload: undefined }
    | { type: (typeof THEME_CLASS_ACTIONS)[4]; payload: IThemePersistantDTO }
    | { type: (typeof THEME_CLASS_ACTIONS)[5]; payload: string };

/**
 * Represents the type of action for the theme class context.
 */
export type IThemeClassActionType = IThemeClassAction["type"];

/**
 * Represents configuration options for persisting theme data.
 */
export type IPersistanceConfiguration = {
    /** The key used for storing theme data. */
    key: string;
    /** Indicates whether persistence is disabled. */
    disabled: boolean;
};

/**
 * Represents partial configuration options for persisting theme data.
 */
export type IPersistanceConfigurationProp = Partial<IPersistanceConfiguration>;
