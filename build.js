var fs        = require('fs'),
    path      = require('path'),
    async     = require('async'),
    marked    = require('marked'),
    mustache  = require('mustache')

var view = {}

fs.readdir('content', function (err, files) {
  if (err) throw err

  var fileCallbacks = files.map(function (file) {
    return function (callback) {
      var filepath = path.join('content', file)

      fs.readFile(filepath, 'utf8', function (err, content) {
        var key = path.basename(file, path.extname(file))
        view[key] = marked(content)

        callback(err)
      })
    }
  })

  async.parallel(fileCallbacks, function (err) {
    if (err) throw err

    fs.readFile('index.mst', 'utf8', function (err, template) {
      if (err) throw err

      var interpolated = mustache.render(template, view)

      fs.writeFile('index.html', interpolated, function (err) {
        if (err) throw err

        console.log('Index updated')
      })
    })
  })
})

