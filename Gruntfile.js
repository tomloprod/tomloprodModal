(function () {
   'use strict';	 
	   
	module.exports = function(grunt) {
	
		  grunt.initConfig({
		  
			pkg: grunt.file.readJSON('package.json'),
			banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> ' +
            '<%= pkg.author %>; Licensed <%= pkg.license %> */',
			
			jshint: {
				all: ['Gruntfile.js', 'src/tomloprodModal.js'],
				 options: {
					bitwise: true,
					camelcase: true,
					curly: true,
					eqeqeq: true,
					forin: true,
					immed: true,
					indent: 4,
					latedef: "nofunc",
					newcap: true,
					noarg: true,
					nonew: true,
					noempty: true,
					devel: true,
					undef: true,
					unused: true,
					strict: true,
					trailing: true,
					browser: true,
					globals: {
						"define": true,
						"module": true
					}
				}
			},
			uglify: {
				build: {
					src: ['src/tomloprodModal.js'],
					dest: 'src/tomloprodModal-<%= pkg.version %>.min.js'
				}
			},
			cssmin: {
			  target: {
				files: [{
				  expand: true,
				  cwd: 'src',
				  src: ['*.css', '!*.min.css'],
				  dest: 'src',
				  ext: '-<%= pkg.version %>.min.css'
				}]
			  }
			},
			usebanner: {
				taskName: {
				  options: {
					position: 'top',
					banner: '<%= banner %>',
					linebreak: true
				  },
				  files: {
					src: [ 'src/*min*']
				  }
				}
		    }

		  });

		  grunt.loadNpmTasks('grunt-contrib-jshint');
		  grunt.loadNpmTasks('grunt-contrib-uglify');  
		  grunt.loadNpmTasks('grunt-contrib-cssmin');
		  grunt.loadNpmTasks('grunt-banner');
		  
		  grunt.registerTask('default', ['jshint', 'uglify', 'cssmin', 'usebanner']);
	};
   
}());