---
to: TODO-<%= name.charAt(0).toLowerCase() + name.substr(1) %>.txt
---
<% var firstLower = name.charAt(0).toLowerCase() + name.substr(1) %>

// Add the following to the top of api/activeRoutes.ts 
    import * as <%= firstLower %>APIInit from './<%= firstLower %>/<%= firstLower %>Routes';

// Add the following to the registerRoutes section of api/activeRoutes.ts 
    <%= firstLower %>APIInit.registerAPI(api);

// Add the following to the registerInit section of api/activeRoutes.ts 
    <%= firstLower %>APIInit.registerInit(api);

// Add the following to the top of web/publicRoutes.ts
    import <%= firstLower %>Routes from './<%= firstLower %>Routes/public<%= name %>Routes';

// Add the following near the bottom of web/publicRoutes.ts, some place after the "New routes here" comment
    project.addRoutes(<%= firstLower %>Routes);

// Run `tsc` to make sure everything compiles
// Run `npm run dev-init` to create the databases
// Run `npm run dev-up-main` to get the site running
// Test that the UI works to view, add, edit and remove data via the paths listed below. Also test that PJAX is working via the console
    - GET (hostname)/<%= name.toLowerCase() %>
    - Try adding a record
    - Try viewing that record
    - Try deleting a record

// Open ./src/api/<%= firstLower %>Model.ts and add any fields important to this data type
// Open ./src/api/<%= firstLower %>Representation.ts and add any fields important to the API representation
// Open ./src/api/<%= firstLower %>ListResource.ts and make any adjustments needed to the modelsResolver, which is the SQL query for loading records
// Open ./src/api/<%= firstLower %>Resource.ts and make any adjustments needed to the append section of modelsResolver, to accomodate any default fields
// Open ./templates/<%= firstLower %>/add<%= name %>.hbs and add any felds that end users must provide when creating a new record
// Open ./templates/<%= firstLower %>/<%= firstLower %>Details.hbs and add any fields you want to show the end user

// Rerun init to update the table with the new fields
// Test that the UI works to add, edit and remove data
// Ensure that the PJAX functionality works

// Add any new web pages and templates to ROUTE LIST NAME 