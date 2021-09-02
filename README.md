# create-roads
An initalizer package for a roads project (replaces roads starter)



# TODO
1. Test example resource endpoints
2. Copy roads-api endpoints over to the templates (maybe write a script for this??)
3. Clean up the api example. wtf is with all the generics all over the place, the code is awful looking. can we define generics in one place? can we use factories to mask the amount of consistent initial parameters we're using?
4. Get web example running (vitejs.dev? matuzo.at/blog/html-boilerplate?)
5. Hook together api and web examples
6. Add proper config support
7. Have a configured option for roads to reroute to roads api
8.  Pull the auto reload work from my other project (reload runner on file change, rebuild on file change, tsc on file change)
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