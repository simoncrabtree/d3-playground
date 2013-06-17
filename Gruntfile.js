'use strict';

var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;
var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};
var appRoot = 'app';

module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-regarde');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-livereload');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-less');

    grunt.initConfig({
        connect: {
            options: {
                base: appRoot
            },
            livereload: {
                options: {
                    port: 9000,
                    middleware: function (connect, options) {
                        return [lrSnippet, mountFolder(connect, options.base)];
                    }
                }
            }
        },
        regarde: {
            less: {
                files: appRoot + '/themes/*.less',
                tasks: ['less:dev', 'livereload']
            },
            all: {
                files: [
                    appRoot + '/**/*.js',
                    appRoot + '/**/*.html',
                    appRoot + '/**/*.css'
                ],
                tasks: ['livereload']
            }
        },
        karma: {
            unit: {
                configFile: 'karma.conf.js',
                reporters: ['growl', 'progress'],
                autoWatch: true
            },
            build: {
                configFile: 'karma.conf.js',
                singleRun: true
            }
        },
        concat: {
            dist: {
                files: {
                    'dist/app/js/app.js': [
                        'app/js/**/*.js'
                    ]
                }
            }
        },
        copy: {
            dist: {
                files: [
                    {src: 'server.js', dest: 'dist/server.js'},
                    {src: 'app/indexdist.html', dest: 'dist/app/index.html'},
                    {src: 'app/views/**/*', dest: 'dist/'},
                    {expand: true, cwd: 'app/libdist/', src: '*.js', dest: 'dist/app/lib/'}
                ]
            }
        },
        less: {
            options: {
                paths: ['app/themes']
            },
            dev: {
                expand: true,
                cwd: 'app/themes',
                src: '*.less',
                dest: 'app/css',
                ext: '.css'
            },
            build: {
                expand: true,
                cwd: 'app/themes',
                src: '*.less',
                dest: 'dist/app/css',
                ext: '.css'
            }
        }
    });

    grunt.registerTask('server', [
                       'less:dev',
                       'livereload-start',
                       'connect',
                       'regarde'
    ]);

    grunt.registerTask('autotest', [
                       'karma:unit'
    ]);

    grunt.registerTask('build', [
                       'karma:build',
                       'concat:dist',
                       'less:build',
                       'copy:dist'
    ]);

};
