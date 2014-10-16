var Gaffa = require('gaffa'),
    Container = require('gaffa-container');
    Frame = require('../');
    Textbox = require('gaffa-textbox'),
    Text = require('gaffa-text');

var gaffa = new Gaffa();

gaffa.registerConstructor(Container);
gaffa.registerConstructor(Frame);
gaffa.registerConstructor(Textbox);
gaffa.registerConstructor(Text);

var frame = new Frame();
frame.url.binding = '[url]';

var urlBox = new Textbox();
urlBox.value.binding = '[url]';

gaffa.model.set('[url]', 'test.json');

var frame2 = new Frame();

window.addEventListener('load', function(){
    gaffa.views.add([
        urlBox,
        frame,
        frame2
    ]);

        
    frame2._load({
        _type:'text',
        text:{
            value:'arbitrary loaded view'
        }
    });
});