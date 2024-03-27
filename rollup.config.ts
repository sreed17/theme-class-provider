// rollup.config.ts

import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import dts from "rollup-plugin-dts";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import terser from "@rollup/plugin-terser";

export default [
    // Config for generating CommonJS and ES modules
    {
        input: "src/index.ts",
        output: [
            {
                file: "dist/index.js",
                format: "cjs",
                sourcemap: true,
            },
            {
                file: "dist/index.mjs",
                format: "es",
                sourcemap: true,
            },
        ],
        plugins: [
            peerDepsExternal(),
            typescript(),
            commonjs(),
            resolve(),
            terser(),
        ],
    },

    // Config for generating declaration file
    {
        input: "src/index.ts",
        output: [{ file: "dist/index.d.ts", format: "es" }],
        plugins: [dts()],
    },
];
