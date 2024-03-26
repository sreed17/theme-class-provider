import React from "react";
import { render, fireEvent } from "@testing-library/react";
import ThemeClassProvider from "../src/ThemeClassContextProvider";
import useThemeClass from "../src/useThemeClassContext";

// Mock children component
const MockChild = () => {
    const { getCurrentTheme, toggleTheme } = useThemeClass();
    return (
        <div>
            <p>Current Theme: {getCurrentTheme()}</p>
            <button
                onClick={() => {
                    toggleTheme();
                }}
            >
                Toggle Theme
            </button>
        </div>
    );
};

test("renders with default theme", () => {
    const themeClasses = ["light", "dark"];
    const { getByText } = render(
        <ThemeClassProvider themeClasses={themeClasses}>
            <MockChild />
        </ThemeClassProvider>
    );
    const defaultThemeText = getByText("Current Theme: light");
    expect(defaultThemeText).toBeInTheDocument();
});

test("toggles theme on button click", () => {
    const themeClasses = ["light", "dark"];
    const { getByText } = render(
        <ThemeClassProvider themeClasses={themeClasses}>
            <MockChild />
        </ThemeClassProvider>
    );
    const toggleButton = getByText("Toggle Theme");
    fireEvent.click(toggleButton);
    const darkThemeText = getByText("Current Theme: dark");
    expect(darkThemeText).toBeInTheDocument();
});
