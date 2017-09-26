var express = require('express');
var router = express.Router();
var mammoth = require("mammoth");
var fs = require('fs');
var conversion = require("phantom-html-to-pdf")();
var multer = require('multer');
var upload = multer({dest: 'public/upload/'});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/parse', upload.single('upload'), function(req, res, next) {
//var delimiter = req.body.delimiter;
var body = req.body.body;
var fileName = req.file.filename;
console.log("csvFile",fileName);
convertToPDF(fileName,res);
/*  rest of the work  */
});

function convertToPDF(fileName,res){
    console.log("hey");
    var fName=fileName+".docx";
    mammoth.convertToHtml({
    path: "./public/upload/"+fileName
  })
  .then(function(result) {
    console.log("hello");
    var html = result.value; // The generated HTML
    var messages = result.messages; // Any messages, such as warnings during conversion
    fs.writeFile("./public/html/1.html", html, function(last) {
      console.log("last step over");    
   });
        convertHTMLtoPDF(fileName,html).then(function(fileName) {
res.send("pdf/"+fileName);
    });
  })
  .done();
   
}

function convertHTMLtoPDF(fileName,html) {
var fileName=fileName+".pdf";
    var html1 = `<!DOCTYPE html>
<html>
<head>
<style>
table {
    font-family: arial, sans-serif;
    border-collapse: collapse;
    width: 100%;
}

td, th {
    border: 1px solid #dddddd;
    text-align: left;
    padding: 8px;
}

tr:nth-child(even) {
    background-color: #dddddd;
}
</style>
</head>
<body>
`+html+`

    </body>
    </html>
    `;
  return new Promise(function(resolve, reject) {
    conversion({
      html: html1
    }, function(err, pdf) {
      var output = fs.createWriteStream("public/pdf/"+fileName);
      console.log(pdf.logs);
      console.log(pdf.numberOfPages);
      // since pdf.stream is a node.js stream you can use it
      // to save the pdf to a file (like in this example) or to
      // respond an http request.
     pdf.stream.pipe(output);

      output.on("close", function() {
        console.log("closee8********************888")
        resolve(fileName);

      });

      output.on("error", function(err) {
        reject(err);
      });

    });


  });


}


module.exports = router;
