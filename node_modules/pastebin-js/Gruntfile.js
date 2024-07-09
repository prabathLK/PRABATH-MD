'use strict';
module.exports = function (grunt){
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            all: [
                'Gruntfile.js',
                'index.js',
                'bin/*.js',
                'lib/*.js',
                'tests/*.js'
            ],
            options: {
                jshintrc : '.jshintrc',
                reporter: require('jshint-stylish'),
                force: false
            }
        },
        watch : {
            jshint : {
                files : '<%= jshint.all %>',
                tasks: ['jshint']
            },
            simplemocha : {
                files : '<%= jshint.all %>'
            }
        },
        simplemocha: {
            options: {},
            all: { src: ['tests/*.js'] }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-simple-mocha');
    grunt.loadNpmTasks('grunt-shell');

    // Default task.
    grunt.registerTask('default', ['jshint']);

    grunt.registerTask('test', ['jshint', 'simplemocha']);
    grunt.registerTask('build', ['test']);

    grunt.registerTask('dev', ['test', 'watch']);
};
