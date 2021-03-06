---
to: tsconfig.json
---
{
    "compilerOptions": {
        "outDir": "./dist/node",
        "target": "es2015",
        "module": "CommonJS",
        "moduleResolution": "node",
        "noImplicitAny": true,
        "strictNullChecks": true,
        "noImplicitThis": true,
        "alwaysStrict": true,
        "baseUrl": ".",
        "paths": {
            "*": [
                "node_modules/*",
                "src/types/*"
            ]
        },
        "allowSyntheticDefaultImports": true,
        "declaration": true,
        "declarationDir": "./types"
    },
    "exclude": [
        "./types",
    ],
    "include": [
        "./src/**/*.ts"
    ]
}
