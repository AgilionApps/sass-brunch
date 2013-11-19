var sysPath = require('path');

describe('sass-brunch plugin', function() {
  var plugin;
  var fileName = 'app/styles/style.scss';

  beforeEach(function() {
    plugin = new Plugin({paths: {root: '.'}});
  });

  it('should be an object', function() {
    expect(plugin).to.be.ok;
  });

  it('should has #compile method', function() {
    expect(plugin.compile).to.be.an.instanceof(Function);
  });

  it('should compile and produce valid result for scss', function(done) {
    var content = '.test {\n  border-color: #fff; }\n';
    var expected = '.test {\n  border-color: #fff; }\n';

    plugin.compile(content, 'file.scss', function(error, data) {
      expect(error).not.to.be.ok;
      expect(data).to.equal(expected)
      done();
    });
  });

  it('should compile and produce valid result for sass', function(done) {
    var content = '.test\n  border-color: #fff';
    var expected = '.test {\n  border-color: white; }\n';

    plugin.compile(content, 'file.sass', function(error, data) {
      expect(error).not.to.be.ok;
      expect(data).to.equal(expected)
      done();
    });
  });

  it('should output valid deps', function(done) {
    var content = "\
    @import _invalid\n\
    @import \'valid1\';\n\
    @import \"./valid2.scss\";\n\
    @import \'../../vendor/styles/valid3\';\n\
    ";

    var expected = [
      sysPath.join('app', 'styles', 'valid1.scss'),
      sysPath.join('app', 'styles', 'valid2.scss'),
      sysPath.join('vendor', 'styles', 'valid3.scss'),
      sysPath.join('app', 'styles', '_valid1.scss'),
      sysPath.join('app', 'styles', '_valid2.scss'),
      sysPath.join('vendor', 'styles', '_valid3.scss'),
      sysPath.join('app', 'styles', 'valid1.sass'),
      sysPath.join('app', 'styles', 'valid2.sass'),
      sysPath.join('vendor', 'styles', 'valid3.sass'),
      sysPath.join('app', 'styles', '_valid1.sass'),
      sysPath.join('app', 'styles', '_valid2.sass'),
      sysPath.join('vendor', 'styles', '_valid3.sass')
    ];

    plugin.getDependencies(content, fileName, function(error, dependencies) {
      expect(error).not.to.be.ok;
      expect(dependencies).to.eql(expected);
      done();
    });
  });
});
