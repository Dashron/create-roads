---
to: .eslintignore
---
# don't ever lint node_modules
node_modules
# don't lint build output (make sure it's set to your correct build folder name)
*.js
*.d.ts
# don't lint nyc coverage output
coverage