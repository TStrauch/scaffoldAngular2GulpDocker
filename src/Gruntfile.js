'use strict';

module.exports = function (grunt) {

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Automatically load required Grunt tasks
  // load grunt config
  // require('load-grunt-tasks')(grunt);
  require('jit-grunt')(grunt, {
    useminPrepare: 'grunt-usemin'
  });

  var appConfig = {
    app: require('./bower.json').appPath || 'app',
    dist: '../dist'
  }

  var modRewrite = require('connect-modrewrite');

  grunt.initConfig({

    config: appConfig,

    //less --> css
    less: {
      development: {
        options: {
          compress: true,
          yuicompress: true,
          optimization: 2
        },
        files: [{
          expand: true,
          src: ['<%= config.app %>/**/*.less'],
          ext: '.css',
          extDot: 'last'
        }]
      }
    },

    wiredep : {
      app: {
        src: ['<%= config.app %>/index.html'],
        // ignorePath:  /\.\.\//,
        // ignorePath:  /\./,
        // ignorePath: /^(\/|\.+(?!\/[^\.]))+\.+/
      },
      options: {
        dependencies: true,
        devDependencies: true,

      }
    },

    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },
      js: {
        files: ['<%= config.app %>/js/**/*.js'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= config.app %>/**/*.html',
          '<%= config.app %>/js/**/*.css',
          '<%= config.app %>/js/**/*.less',
          '<%= config.app %>/styles/**/*.less',
          '<%= config.app %>/styles/**/*.css',
          '<%= config.app %>/img/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      },
      less:{
        files: ['<%= config.app %>/**/*.less'],
        tasks: ["less"],
        options: {
            nospawn: true
        }
      }
    },

    open: {
      dev: {
          url: 'http://localhost:<%= connect.options.port %>',
          app: 'Google Chrome'
      }
    },


    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        // hostname: '0.0.0.0',
        hostname: 'localhost',
        livereload: 35729
      },
      livereload: {
        options: {
          open: false,
          middleware: function (connect) {
            // var proxySnippet = require('grunt-connect-proxy/lib/utils').proxyRequest;
            return [
              // proxySnippet,
              connect().use('/', function (req, res, next) {
                res.setHeader('Access-Control-Allow-Origin', '*');
                next();
              }),
              modRewrite(['^[^\\.]*$ /index.html [L]']),
              connect.static('.tmp'),
              connect().use(
                '/bower_components',
                connect.static('./bower_components')
              ),
              connect().use(
                '/node_modules',
                connect.static('./node_modules')
              ),
              connect().use(
                '/app/styles',
                connect.static('./app/styles')
              ),
              connect.static(appConfig.app)
            ];
          }
        }
      },
      dist: {
        options: {
          open: true,
          base: '<%= config.dist %>'
        }
      }
    },


  });


  grunt.registerTask('serve', 'Compile then start a connect web server', function (target) {

    grunt.task.run([
      'wiredep',
      'connect:livereload',
      'open:dev', //open chrome instead of default browser
      'watch'
    ]);
  });

  grunt.registerTask('default', [
    'serve'
  ]);

};
