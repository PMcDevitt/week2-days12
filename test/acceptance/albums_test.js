require('../helper');

var http = require('http'),
    server;
var db = require('../../config/database')
var album = db.get('albums')

before(function() {
  server = http.createServer(require('../../app'));
  server.listen(0);
  browser.baseUrl = 'http://localhost:' + server.address().port;
});

beforeEach(function() {
  album.remove({})
  return browser.ignoreSynchronization = true;
});

after(function(){
  album.remove({})
  server.close();
});

describe('Given Album CRUD', function(){
  describe('When I visit the entry page(/)', function () {
    it('Then I see a header indicating it is the albums Index', function() {
      browser.get('/');
      element(by.tagName('h1')).getText().then(function(text) {
        expect(text).to.equal('OMG Albums!');
      });
    });
    it('Then I see a link to take me to the album page', function() {
      browser.get('/');
      element(by.tagName('a')).getText().then(function(text) {
        expect(text).to.equal('Let me see the RIGHT NOW!');
      });
    });

    describe('When I click on the link', function(){
      it('Then I navigate to the /albums page', function(){
        browser.get('/');
        console.log('testing')
        element(by.tagName('a')).click()
        browser.getPageSource().then(function(data){
            expect(data).to.contain('<a href="/albums/new">New Album</a>')
            expect(data).to.contain('<h1>Albums</h1>')
        })
      })
    })
  });

  describe('When I visit "/albums" page', function(){
    it('Then I should see the header Albums', function(){
      browser.get('/albums')
      element(by.tagName('h1')).getText().then(function(text){
        expect(text).to.equal('Albums')
      })
    })

    it('Then I see a link to add a new album called "New Album"', function() {
      browser.get('/albums');
      element(by.tagName('a')).getText().then(function(text) {
        expect(text).to.equal('New Album');
      });
    });
    it('Then check the link for "New Album"', function(){
      browser.get('/albums')
      element(by.tagName('a')).isPresent().then(function(isPresent){
      expect(isPresent).to.be.true
      })
    })

    it('Then I should see an Album link for each album', function(done){
      //insert 2 there should be 3
      //console.log(album)
      var album1 = {genre:'Jazz', artist:'Miles Davis', album:'Kind of Blue'}
      var album2 = {genre:'Pop', artist:'B52s', album:'Cosmic Thing'}
      album.insert([album1, album2]).then(function(err, albums){
        console.log(albums)
        browser.get('/albums')
        element.all(by.tagName('a')).then(function(link){
          expect(link.length).to.equal(3)
          done()
        })
      })
    })

    describe('When I click on the link', function(){
      it('Then I navigate to the /albums/new', function(){
        browser.get('/albums');
        element(by.tagName('a')).click()
        browser.getPageSource().then(function(data){
            expect(data).to.contain('<legend>Create album</legend>')
        })
      })
    })
  })
  describe('Given I vist the /albums/new page', function(){
    it('Then I should see the Fieldset Create album', function(){
      browser.get('/albums/new')
      element(by.tagName('legend')).getText().then(function(text){
        expect(text).to.equal('Create album')
      })
    })
  })

//Delete confirmation

// describe('Given an app for delete',function(){
//   describe('delete confirm page', function(){
//     it('then i should see question for confirm',function(){
//       browser('/albums/123/deleteconfirm')
//       element(by.tagName('h')).isPresent().then(function(isPresent){
//         expect(isPresent).to.be.true
//       })
//       element(by.tagName('h')).getText().then(function(heading){
//         expect(heading).to.equal('Delete')
//       })
//     })
//   })
// })

  describe('When I click on the cancel link', function(){
    it('Then I navigate to the /albums', function(){
      browser.get('/albums/new');
      element(by.tagName('a')).click()
      browser.getPageSource().then(function(data){
        expect(data).to.contain('<a href="/albums/new">New Album</a>')
        expect(data).to.contain('<h1>Albums</h1>')
      })
    })
  })
});
