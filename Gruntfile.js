/**
 @author Zachary Wartell

 REFERENCES:
 - https://gruntjs.com/sample-gruntfile
 - https://www.npmjs.com/package/grunt-jsdoc
 */
module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jsdoc : {
            dist : {
                src: ['README.md','Mat4Stack.js','Mat3.js','Mat4.js','Mat2.js','Sphere.js','Interaction.js','Cite.js'],//'*.js'],
                options: {
                    destination: 'doc',
                    configure: 'Lighting/make/jsdoc.conf'
                }
            }
        },
        watch: {
            files: ['<%= jsdoc.files %>'],
            tasks: ['jsdoc']
        }
    });

    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['jsdoc']);
};
