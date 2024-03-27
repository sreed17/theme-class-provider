import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ThemeClassProvider from "../src/ThemeClassContextProvider";
import useThemeClass from "../src/useThemeClassContext";
import { IThemePersistantDTO } from "../src/theme-class-provider.types";
import { setPersistedThemeData } from "../src/utils";

// Mock children component
const MockChild = () => {
    const { getCurrentTheme, toggleTheme, getThemeClasses } = useThemeClass();
    return (
        <div>
            <p>Current Theme: {getCurrentTheme()}</p>
            <p>Theme Classes: {JSON.stringify(getThemeClasses())}</p>
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

// Test whether the default theme is rendered by default
test("renders with default theme", () => {
    const themeClasses = ["light", "dark"];
    const { getByText } = render(
        <ThemeClassProvider
            themeClasses={themeClasses}
            persist={{ disabled: true }}
        >
            <MockChild />
        </ThemeClassProvider>
    );
    const defaultThemeText = getByText("Current Theme: light");
    expect(defaultThemeText).toBeInTheDocument();
});

// Test theme toggling
test("toggles theme on button click", () => {
    const themeClasses = ["light", "dark"];
    const { getByText } = render(
        <ThemeClassProvider
            themeClasses={themeClasses}
            persist={{ disabled: true }}
        >
            <MockChild />
        </ThemeClassProvider>
    );
    const toggleButton = getByText("Toggle Theme");
    fireEvent.click(toggleButton);
    const darkThemeText = getByText("Current Theme: dark");
    expect(darkThemeText).toBeInTheDocument();
});

test("toggles theme on button click 2 times", () => {
    const themeClasses = ["red", "green", "blue"];
    const { getByText } = render(
        <ThemeClassProvider
            themeClasses={themeClasses}
            persist={{ disabled: true }}
        >
            <MockChild />
        </ThemeClassProvider>
    );
    const toggleButton = getByText("Toggle Theme");
    fireEvent.click(toggleButton);
    fireEvent.click(toggleButton);
    const themeText = getByText("Current Theme: blue");
    expect(themeText).toBeInTheDocument();
});

test("toggles theme till its cycles back", () => {
    const themeClasses = ["red", "green", "blue"];
    const { getByText } = render(
        <ThemeClassProvider
            themeClasses={themeClasses}
            persist={{ disabled: true }}
        >
            <MockChild />
        </ThemeClassProvider>
    );
    const toggleButton = getByText("Toggle Theme");
    fireEvent.click(toggleButton);
    fireEvent.click(toggleButton);
    fireEvent.click(toggleButton);
    const themeText = getByText("Current Theme: red");
    expect(themeText).toBeInTheDocument();
});

test("Change the default theme on load", () => {
    const themeClasses = ["red", "green", "blue"];
    const { getByText } = render(
        <ThemeClassProvider
            defaultTheme="green"
            themeClasses={themeClasses}
            persist={{ disabled: true }}
        >
            <MockChild />
        </ThemeClassProvider>
    );

    const newThemeClasses = ["green", "blue", "red"];
    const themeText = getByText("Current Theme: green");
    expect(themeText).toBeInTheDocument();
    const themeClassesText = getByText(
        `Theme Classes: ${JSON.stringify(newThemeClasses)}`
    );
    expect(themeClassesText).toBeInTheDocument();
});

// Test persistence of local storage data
test("persists theme in local storage", () => {
    const key = "theme";
    const themeClasses = ["light", "dark"];
    const persitedData: IThemePersistantDTO = {
        current: 1,
        theme_classes: themeClasses,
    };
    setPersistedThemeData(key, persitedData);
    const { getByText } = render(
        <ThemeClassProvider themeClasses={themeClasses} persist={{ key }}>
            <MockChild />
        </ThemeClassProvider>
    );
    const darkThemeText = getByText("Current Theme: dark");
    expect(darkThemeText).toBeInTheDocument();
});

// Test whether an error is thrown when themeClasses is an empty array
test("throws error when themeClasses is an empty array", () => {
    const consoleError = jest.spyOn(console, "error");
    consoleError.mockImplementation(() => {}); // Suppress console error output

    expect(() =>
        render(
            <ThemeClassProvider themeClasses={[]} persist={{ disabled: true }}>
                <MockChild />
            </ThemeClassProvider>
        )
    ).toThrow("Value Error: Theme-classes list must not be empty");

    consoleError.mockRestore(); // Restore console.error
});

// Mock onChange function
// const mockOnChange = jest.fn();
// // Test whether the onChange overide is working previous value is updates correctly
// test("onChange override works and previous value is updated correctly", () => {
//     const themeClasses = ["red", "green", "blue"];
//     const { getByText } = render(
//         <ThemeClassProvider
//             themeClasses={themeClasses}
//             onChange={(current, prev, classList) => {
//                 console.log(current, prev, classList);
//                 mockOnChange(current, prev, classList);
//             }}
//             persist={{ key: "test_theme_data", disabled: true }}
//         >
//             <MockChild />
//         </ThemeClassProvider>
//     );

//     const classes = getByText(`Theme Classes: ${JSON.stringify(themeClasses)}`);
//     expect(classes).toBeInTheDocument();

//     expect(mockOnChange).toHaveBeenCalledWith(0, null, themeClasses);

//     fireEvent.click(getByText("Toggle Theme"));

//     expect(mockOnChange).toHaveBeenCalledWith(1, 0, themeClasses);

//     fireEvent.click(getByText("Toggle Theme"));

//     expect(mockOnChange).toHaveBeenCalledWith(2, 1, themeClasses);
// });
