/**
 * @file ThemeClassContextProvider.tsx
 * @description Provider component for managing theme class context.
 */

import React, {
    FC,
    PropsWithChildren,
    useEffect,
    useMemo,
    useReducer,
} from "react";
import ThemeClassContext from "./ThemeClassContext";
import {
    IPersistanceConfiguration,
    IPersistanceConfigurationProp,
    IThemeChangeSideEffect,
    IThemeClassContext,
    IThemeClassState,
    IThemePersistantDTO,
} from "./theme-class-provider.types";
import themeClassContextReducer from "./themeClassContextReducer";
import {
    clearPersistedThemeData,
    getPersistedThemeData,
    setPersistedThemeData,
    updateThemeClassOfDocumentElement,
} from "./utils";

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
 * Default configuration for persistance.
 */
const default_persistance_config: IPersistanceConfiguration = {
    key: "theme-data",
    disabled: false,
    clearOnUnload: false,
};

/**
 * ThemeClassContextProvider component.
 * Manages the theme class context and provides it to child components.
 */
const ThemeClassContextProvider: FC<PropType> = ({
    themeClasses,
    children,
    persist,
    onChange,
    defaultTheme,
}) => {
    // Merge provided persistence configuration with default configuration
    const persist_config = { ...default_persistance_config, ...persist };

    // Check for empty theme-classes array
    if (themeClasses.length === 0) {
        throw new Error("Value Error: Theme-classes list must not be empty");
    }

    // Initial theme state
    const initial_state: IThemeClassState = {
        previous: null,
        current: 0,
        is_loading: true,
        theme_classes: themeClasses,
        error: null,
        loaded_persisted_data: false,
    };

    // Reducer to manage theme class context state
    const [state, dispatch] = useReducer(
        themeClassContextReducer,
        initial_state
    );

    // Memoized persisted theme data
    const persistedThemeData = useMemo(
        () => ({
            current: state.current,
            theme_classes: state.theme_classes,
        }),
        [state.current, state.theme_classes]
    );

    // Memoized persisted theme key
    const persistedThemeKey = useMemo(
        () => persist_config.key,
        [persist_config.key]
    );

    // Load persisted theme data on component mount
    const loadState = (theme_dto: IThemePersistantDTO) => {
        dispatch({ type: "LOAD_STATE", payload: theme_dto });
    };

    // Set the persisted-data-loaded flag
    const setPersistedDataLoadedFlag = (flag: boolean) => {
        dispatch({ type: "FLAG_PERSISTED_DATA_LOAD", payload: flag });
    };

    // Set is_loading state
    const setLoadingState = (flag: boolean) => {
        dispatch({ type: "SET_LOADING_STATE", payload: flag });
    };

    // Set a given theme as default
    const setDefault = (theme_class: string) => {
        dispatch({ type: "SET_DEFAULT", payload: theme_class });
    };

    // on load
    useEffect(() => {
        const { key } = persist_config;
        const theme_data = getPersistedThemeData(key);

        if (theme_data) {
            loadState(theme_data);
            setPersistedDataLoadedFlag(true);
        } else if (defaultTheme != null) {
            setDefault(defaultTheme);
        }

        // Set Loading state to false
        setLoadingState(false);

        return () => {
            if (persist_config.clearOnUnload) {
                clearPersistedThemeData(key);
            }
        };
    }, []);

    // Update persisted theme data on theme or theme classes change
    useEffect(() => {
        if (state.is_loading || persist_config.disabled) {
            return;
        }
        setPersistedThemeData(persistedThemeKey, persistedThemeData);
        if (onChange) {
            onChange(state.current, state.previous, state.theme_classes);
        }
    }, [state.current, state.previous, state.theme_classes]);

    // Theme class context value
    const value: IThemeClassContext = {
        is_loading: state.is_loading,
        error: state.error,
        loaded_persisted_data: state.loaded_persisted_data,
        setCurrentTheme: (theme_class: string) => {
            dispatch({ type: "SET_CURRENT_THEME_CLASS", payload: theme_class });
        },
        getCurrentTheme: () => {
            return state.theme_classes[state.current];
        },
        toggleTheme: () => {
            dispatch({ type: "TOGGLE_THEME", payload: undefined });
        },
        setThemeClasses: (classes: string[]) => {
            dispatch({ type: "SET_THEME_CLASSES", payload: classes });
        },
        getThemeClasses: () => state.theme_classes,
        loadState,
        clearPersistedThemeData: () => {
            clearPersistedThemeData(persist_config.key);
        },
        setDefault,
    };

    // Render the context provider
    return (
        <ThemeClassContext.Provider value={value}>
            {children}
        </ThemeClassContext.Provider>
    );
};

// Define default props
ThemeClassContextProvider.defaultProps = {
    persist: {},
    defaultTheme: null,
    onChange: updateThemeClassOfDocumentElement,
};

export default ThemeClassContextProvider;
