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
    var gaffa = this.gaffa;

    if(value == null){
        return;
    }

    if(view._pendingRequest){
        view._pendingRequest.abort();
        view._pendingRequest = null;
    }

    view._pendingRequest = gaffa.ajax({
        url: value,
        type: 'get',
        dataType: 'json',
        success: function(data){
            var viewDefinition = statham.revive(data),
                child = gaffa.initialiseView(viewDefinition);

            if(view._loadedView){
                view._loadedView.remove();
                view._loadedView = null;
            }

            view._loadedView = child;
            view.views.content.abortDeferredAdd();
            view.views.content.add(child);
            view.triggerActions('success');
        },
        error: function(error){
            view.triggerActions('error', {error: error});
        },
        complete: function(){
            view.triggerActions('complete');
            view._pendingRequest = null;
        }
    });
});

module.exports = Frame;