expat = require("node-expat");
const fs = require('fs');

fs.readFile('bomba.xml', (err, data) => {
    if (!err) {
        let xmlSrc = data,
            parser = new expat.Parser();
        parser.on('startElement', function (name, attrs) {
            console.log(name, attrs)
        })
        parser.on('endElement', function (name) {
            console.log(name)
        })

        parser.on('text', function (text) {
            console.log(text)
        })

        parser.on('error', function (error) {
            console.error(error)
        })
        //parser.on("startElement", handleStart);
        //parser.on("text", handleText);
        parser.write(xmlSrc);
    }
});


// xpath queries
/*var gchild = xmlDoc.get('//grandchild');

console.log(gchild.text());  // prints "grandchild content"

var children = xmlDoc.root().childNodes();
var child = children[0];

console.log(child.attr('foo').value()); */