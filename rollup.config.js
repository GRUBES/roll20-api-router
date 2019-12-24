import json from "@rollup/plugin-json";

export default {
    input: "src/router.js",
    output: [{
        file: "dist/roll20-api-router.js",
        format: "iife",
        name: "ApiRouter"
    }],
    plugins: [json()]
}
