var fsx = require('fs-extended');
var fs = require('fs');
var exifParser = require('exif-parser');

var sourceDir = process.env.LOCALAPPDATA + '\\Packages\\Microsoft.Windows.ContentDeliveryManager_cw5n1h2txyewy\\LocalState\\Assets';
var outputDir = '.\\spotlightPictures';
fsx.createDir(outputDir);

// var test = outputDir + '\\1ea62e08b77bf90cca49a05fc65e33e38e1dba3644321abd6125ad99be504f85.jpg';
// var info = getExif(test);

function getExif(filePath){
    var buffer = fs.readFileSync(filePath);
    var parser = exifParser.create(buffer);
    return parser.parse();
}

function filter(itemPath, stat) {
    try{
        var exif = getExif(itemPath);
        return stat.isFile() && exif.imageSize.width >= 1366 && exif.imageSize.width > exif.imageSize.height;
    }
    catch(ex){
            console.log(itemPath.split('\\').pop(), stat.size);
        return false;
    }
}
 
fsx.listAll(sourceDir, { filter: filter }, function (err, files) {
    if(err){
        console.log(err);
        return;
    }
     
    for(var file of files){
        fsx.copyFileSync(sourceDir + '\\' + file, outputDir + '\\' + file + '.jpg');
    }
});
