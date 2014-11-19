module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jscs');
  grunt.loadNpmTasks('grunt-simple-mocha');

  grunt.initConfig({
    jshint: {
      options: {
        node: true,
        jshintrc: true
      },
      src: ['server.js', 'routes/**/*.js', 'lib/*.js']
    },

    jscs: {
      src: ['server.js', 'routes/**/*.js','lib/*.js'],
      options: {
        config: '.jscsrc'
      }
    },

    simplemocha: {
      options: {
        timeout: 3000,
        reporter: 'tap'
      },

      all: {src: ['test/user_test.js','test/concierge_test.js','test/change_test.js','test/jobs_test.js']}

    }
  
  });

  grunt.registerTask('test', ['jshint', 'jscs', 'simplemocha']);
  grunt.registerTask('default',['test']);
};
