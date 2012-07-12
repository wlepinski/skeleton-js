/*global module:false*/
module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib');
  grunt.loadNpmTasks('grunt-coffee');
  grunt.loadNpmTasks('grunt-requirejs');

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    meta: {
      banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
    },
    lint: {
      files: ['grunt.js', 'lib/**/*.js', 'tests/**/*.js']
    },
    qunit: {
      files: ['tests/**/*.html']
    },
    concat: {
      dist: {
        src: ['<banner:meta.banner>', '<file_strip_banner:lib/skeleton.js>'],
        dest: 'dist/skeleton-<%= pkg.version %>.js'
      }
    },
    min: {
      dist: {
        src: ['<banner:meta.banner>', '<config:concat.dist.dest>'],
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'lint qunit'
    },
    coffee: {
      app: {
        src: ['coffee/**/*.coffee'],
        dest: 'lib'
      }
    },
    requirejs: {
      baseUrl: 'lib',
      name: 'skeleton',
      out: 'lib/skeleton.js',
      wrap: true,
      removeCombined: true,
      useSourceUrl: false,
      skipModuleInsertion: false,
      optimizeAllPluginResources: true,
      findNestedDependencies: true
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true
      },
      globals: {
        jQuery: true
      }
    },
    uglify: {}
  });

  // Default task.
  grunt.registerTask('default', 'lint qunit concat min');
  grunt.registerTask('release', 'coffee requirejs:js concat');

};
