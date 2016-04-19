var express = require('express');
var router = express.Router();
var db = require('../config/database')

var albumCollection = db.get('albums')


router.get('/', function (req, res) {
  albumCollection.find({}, function(err, albumFromMongo){
    res.render('albums/albums', {albums: albumFromMongo});
  })
});
router.get('/new', function(req, res){
  res.render('albums/new')
})

router.post('/new', function(req, resp){
  albumCollection.insert(req.body, function(err, album){
    resp.redirect('/albums')
  })
})

router.get('/:id', function(req, resp){
  var searchId = req.params.id;
  albumCollection.find({_id: searchId}, function(err, albumObj){
    if(err)
      throw err

    resp.render('albums/view', { returnAlbum: albumObj[0]})
  })
})

router.get('/:id/edit', function(req, resp){
  var searchId = req.params.id;
  albumCollection.find({_id: searchId}, function(err, albumObj){
    if(err)
      throw err

      console.log(albumObj[0])
    resp.render('albums/edit', { returnAlbum: albumObj[0]})
  })
})

router.put('/edit', function(req, res) {
  console.log(req.body)

  albumCollection.update({'query': { "_id": req.params.id },{},{})

    albumCollection.findAndModify({
        "query": { "_id": req.params.id },
        "update": { "$set": req.body }}, function(err, doc){
          if (err) throw err;
            console.log(doc)
          res.redirect('/albums')
        })
})

module.exports = router;
