const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
// on require les modules précédements installés avec npm install gulp gulp-sass browser-sync

//definition de la fonction style qui va nous permettre de compiller les .scss en css
function style(){
    // Ou sont mes fichiers scss ?
    // si je veut tout les subdossier d'un dossier je peux faire ./scss/**/*.scss
    return gulp.src(['./scss/*.scss'])
    // on passe dans le compiler sass
    .pipe(sass().on('error', sass.logError))
    // ou je sauvegarde mes fichiers compilés CSS ?
    .pipe(gulp.dest("./css"))
    // On passe dans le stream browser sync pour eviter a avoir a rafraichir la page
    // a chaque fois
    .pipe(browserSync.stream());
    }
    


// definition de la fonction watch qui va surveiller tout nos fichiers html css scss et js
// et actualiser notre browser si il y a eu modification d'un fichier. 
function watch(){
browserSync.init({
    // on definir ou doit se placer notre serveur 
    baseDir: "./",
    server: "./"  
});
// Puis on surveille...
gulp.watch(['./scss/**/*.scss'], style);
gulp.watch("./*.html").on('change', browserSync.reload);
gulp.watch("./css/**/*.css").on('change', browserSync.reload);
//gulp.watch("./js/*.js").on('change', browserSync.reload);

}



exports.style = style;
exports.watch = watch;