module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jscs');
  grunt.loadNpmTasks('grunt-simple-mocha');
  grunt.loadNpmTasks('grunt-mongo-drop');

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
        //timeout: 3000,
        //ignoreLeaks: false,
        reporter: 'tap'
      },
<<<<<<< HEAD
      src: [/*'test/user_test.js', 'test/concierge_test.js',*/'test/jobs_test.js']
=======
      src: ['test/user_test.js']
    },
    mongo_drop: {
        test: {
          uri: process.env.MONGO_URL
>>>>>>> upstream/dev
    }
  }
  });

  grunt.registerTask('test', ['jshint', 'jscs', 'simplemocha', 'mongo_drop']);
  grunt.registerTask('default',['test']);
};
