# scaffoldAngular2GulpDocker
Clone this repo if you want a quick start for your Angular 2 App with Typescript, Gulp and Docker already configured.
!!! If you want the scaffold to work out of the box please use Github's Atom editor and install the "atom-typescript" package (recommended).

Otherwise you need to adapt the gulpfile slightly. You can use the setup from Dan Wahling:
https://github.com/DanWahlin/AngularIn20TypeScript/blob/master/gulpfile.js

I keep a gruntfile and a gulpfile simply because there is a bug in fsevents that is used by browserSync that prevents it from working on an ubuntu host (which we have when running in docker). I therefore use gulp to build the production version of the app (Gulp has the plugin gulp-inline-ng2-template which is not available for Grunt but is super useful to make your code production ready) and Grunt zu run the development server inside a Docker container.
