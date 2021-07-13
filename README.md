# create-roads
An initalizer package for a roads project (replaces roads starter)



# TODO
1. Modify web files in the init script to go into a web directory
2. Create new init script files for creating an example API
3. Get the API up and running alongside the web, and add an integration example tying them together
4. Add config support
5. Add logger support
6. Have a configured option for roads to reroute to roads api
7. Pull the auto reload work from my other project (reload runner on file change, rebuild on file change, tsc on file change)
Bring over some of the improvements from dd:
- template reloading
- live static file reloading
- api project registration
- automatic server restarting, ts watch and watchify
- code generation scripts for starter files
- form stuff
1. Update the API init script to look at a JSON schema and make some smart guesses
2. Add CSRF protection to the roads side
3.  Pull over the form validation work from roads starter and my other project
4.  Pull over the common API and web routes from other project
5.  Decide what to do with authentication
6.  Decide what to do with user module
7.  Decide if we actually wnat to use docker