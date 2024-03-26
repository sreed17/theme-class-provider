/**
 * @file themeClassContextReducer.ts
 * @description Reducer function for managing state in the theme class context.
 */

import { produce } from "immer";
import {
    IThemeClassAction,
    IThemeClassState,
} from "./theme-class-provider.types";
import { isValidPayload, mod } from "./utils";

/**
 * Reducer function for managing state in the theme class context.
 * @param state The current state of the theme class context.
 * @param action The action dispatched to update the state.
 * @returns The new state after applying the action.
 */
function themeClassContextReducer(
    state: IThemeClassState,
    action: IThemeClassAction
) {
    return produce(state, (draft) => {
        // Type checking the action
        if (!isValidPayload(action.type, action.payload)) {
            const err = new Error(
                "Type Error: Invalid ThemeClassAction type, Check the dispatched action object"
            );
            draft.error = err;
            return draft;
        }

        const action_type = action.type;

        // Reset error at each call
        draft.error = null;
        // Process action
        switch (action_type) {
            case "SET_LOADING_STATE": {
                draft.is_loading = action.payload;
                break;
            }
            /**
             * Set the theme_classes list and resets to the default theme-class
             * This will reset the current, previous states
             */
            case "SET_THEME_CLASSES": {
                if (action.payload.length === 0) {
                    const err = new Error(
                        "Value Error: Theme-classes list must not be empty"
                    );
                    draft.error = err;
                    return draft;
                }
                draft.theme_classes = action.payload;
                draft.previous = null;
                draft.current = 0;
                break;
            }
            /**
             * Set the current theme to the given arg
             */
            case "SET_CURRENT_THEME_CLASS": {
                const theme_index = draft.theme_classes.indexOf(action.payload);

                if (theme_index === -1) {
                    const err = new Error(
                        "Invalid Value Error: Can't set to the proveded theme-class since it does not exist in the theme-classes list"
                    );
                    draft.error = err;
                    break;
                }
                draft.previous = draft.current;
                draft.current = theme_index;
                break;
            }
            /**
             * Cycle through the theme_classes list
             */
            case "TOGGLE_THEME": {
                const n_themes = draft.theme_classes.length;
                const current = draft.current;
                draft.previous = current;
                const next_theme = current + 1 >= n_themes ? 0 : current + 1;
                draft.current = next_theme;
                break;
            }
            /**
             * Load a previous state
             */
            case "LOAD_STATE": {
                const { current, theme_classes } = action.payload;
                draft.previous = null;
                draft.current = current;
                draft.theme_classes = theme_classes;
                break;
            }
            case "SET_DEFAULT": {
                // Find index of the provided theme class
                const theme_index = draft.theme_classes.indexOf(action.payload);

                // Check if the theme class exists in the list
                if (theme_index === -1) {
                    const err = new Error(
                        "Invalid Value Error: Can't set to the proveded theme-class since it does not exist in the theme-classes list"
                    );
                    draft.error = err;
                    break;
                }

                // Reorder theme classes to set the provided theme class as default (zero indexed)
                const theme_classes: string[] = [];
                const n = draft.theme_classes.length;

                for (let i = 0; i < n; i++) {
                    const rel_index = i - theme_index;
                    const index = rel_index < 0 ? mod(rel_index, n) : rel_index;
                    theme_classes[index] = draft.theme_classes[i];
                    if (i === draft.previous) {
                        draft.previous = index;
                    }
                }

                // Update state with reordered theme classes and reset current theme index
                draft.theme_classes = theme_classes;
                draft.current = 0;
                break;
            }
            /**
             * Set a boolean flag to indicate whether a persisted data has been loaded or not
             */
            case "FLAG_PERSISTED_DATA_LOAD": {
                draft.loaded_persisted_data = action.payload;
                break;
            }
        }

        return draft;
    });
}

export default themeClassContextReducer;
