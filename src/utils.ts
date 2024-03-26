/**
 * @file Provides utility functions for managing theme class actions and persistent data.
 * @description This module contains functions for validating theme class actions, managing persistent theme data in local storage, and handling related operations.
 */

import {
    IThemeClassActionType,
    IThemePersistantDTO,
    THEME_CLASS_ACTIONS,
} from "./theme-class-provider.types";

/**
 * Checks if the provided argument is a valid theme class action type.
 * @param arg The argument to check.
 * @returns A boolean indicating whether the argument is a valid theme class action type.
 */
export function isThemeClassActionType(
    arg: unknown
): arg is IThemeClassActionType {
    if (typeof arg !== "string") {
        return false;
    }
    return THEME_CLASS_ACTIONS.includes(arg as IThemeClassActionType);
}

/**
 * Checks if the provided argument is a valid theme class list.
 * @param arg The argument to check.
 * @returns A boolean indicating whether the argument is a valid theme class list.
 */
export function isThemeClassList(arg: unknown): arg is string[] {
    if (!Array.isArray(arg)) {
        return false;
    }
    return arg.every((class_value) => typeof class_value === "string");
}

/**
 * Checks if the provided argument is a valid current theme index.
 * @param arg The argument to check.
 * @param max The maximum allowed index.
 * @returns A boolean indicating whether the argument is a valid current theme index.
 */
export function isValidCurrentThemeIndex(arg: unknown, max: number): boolean {
    if (typeof arg !== "number") {
        return false;
    }
    return arg >= 0 && arg < max;
}

/**
 * Checks if the provided argument is a valid theme persistent data object.
 * @param arg The argument to check.
 * @returns A boolean indicating whether the argument is a valid theme persistent data object.
 */
export function isThemePersistantDTO(arg: unknown): arg is IThemePersistantDTO {
    if (!arg || typeof arg !== "object") {
        return false;
    }
    return (
        arg != null &&
        typeof arg === "object" &&
        "theme_classes" in arg &&
        isThemeClassList(arg.theme_classes) &&
        "current" in arg &&
        isValidCurrentThemeIndex(arg.current, arg.theme_classes.length)
    );
}

/**
 * Checks if the payload for a given action type is valid.
 * @param type The type of the action.
 * @param payload The payload of the action.
 * @returns A boolean indicating whether the payload is valid for the given action type.
 */
export function isValidPayload(
    type: IThemeClassActionType,
    payload: unknown
): boolean {
    switch (type) {
        case "SET_CURRENT_THEME_CLASS": {
            return typeof payload === "string";
        }
        case "SET_LOADING_STATE": {
            return typeof payload === "boolean";
        }

        case "SET_THEME_CLASSES": {
            return isThemeClassList(payload);
        }
        case "TOGGLE_THEME": {
            return payload == null || payload === undefined;
        }
        case "LOAD_STATE": {
            return isThemePersistantDTO(payload);
        }
        case "SET_DEFAULT": {
            return typeof payload === "string";
        }
        case "FLAG_PERSISTED_DATA_LOAD": {
            return typeof payload === "boolean";
        }
    }
    return false;
}

/**
 * Retrieves persisted theme data from local storage.
 * @param key The key under which the theme data is stored.
 * @returns The retrieved theme data if found, otherwise null.
 */
export function getPersistedThemeData(key: string): IThemePersistantDTO | null {
    try {
        const serializedData = localStorage.getItem(key);
        if (!serializedData) {
            return null;
        }

        const data = JSON.parse(serializedData);
        return isThemePersistantDTO(data) ? data : null;
    } catch (error) {
        console.error("Error retrieving persisted theme data:", error);
        return null;
    }
}

/**
 * Sets persisted theme data in local storage.
 * @param key The key under which to store the theme data.
 * @param value The theme data to store.
 */
export function setPersistedThemeData(
    key: string,
    value: IThemePersistantDTO
): void {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error("Error setting persisted theme data:", error);
    }
}

/**
 * Clears persisted theme data from local storage.
 * @param key The key under which the theme data is stored.
 */
export function clearPersistedThemeData(key: string): void {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error("Error clearing persisted theme data:", error);
    }
}

/**
 * Sets current theme class to the document.documentElement.
 * This is set as the default behaviour when no onChange is provided by the user
 */

export function updateThemeClassOfDocumentElement(
    current: number,
    previous: number | null,
    theme_classes: string[]
) {
    try {
        if (previous !== null) {
            const previous_class = theme_classes[previous];
            document.documentElement.classList.remove(previous_class);
        }
        const current_class = theme_classes[current];
        document.documentElement.classList.add(current_class);
    } catch (err) {
        console.error("Error changing the document theme class");
    }
}

/**
 * Compute the non negative modulo operation
 * @param n - The divident
 * @param m - The divisor
 * @returns - Non-negative remainder when n is dividen by m
 */
export function mod(n: number, m: number) {
    return ((n % m) + m) % m;
}
