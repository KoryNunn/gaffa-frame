var Gaffa = require('gaffa'),
    crel = require('crel'),
    statham = require('statham');

function Frame(){}
Frame = Gaffa.createSpec(Frame, Gaffa.ContainerView);
Frame.prototype._type = 'frame';

Frame.prototype.render = function(){
    var textNode = document.createTextNode(''),
        renderedElement = crel(this.tagName || 'div');

    this.views.content.element = renderedElement;

    this.renderedElement = renderedElement;
};

Frame.prototype.url = new Gaffa.Property(function(view, value){
    if(this._loadedView){
        this._loadedView.remove();
    }

    if(value == null){
        return;
    }

    this.gaffa.ajax({
        url: value,
        type: 'get',
        dataType: 'json',
        success: function(data){
            var viewDefinition = statham.revive(data),
                child = gaffa.initialiseViewItem(viewDefinition, view.gaffa, gaffa.views._constructors);

            view._loadedView = child;
            view.views.content.add(child);
            view.triggerActions('success');
        },
        error: function(error){
            view.triggerActions('error', {error: error});
        },
        complete: function(){
            view.triggerActions('complete');
        }
    });
});

module.exports = Frame;