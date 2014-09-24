var Gaffa = require('gaffa'),
    crel = require('crel'),
    statham = require('statham'),
    Ajax = require('simple-ajax');

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
        view._pendingRequest.request.abort();
        view._pendingRequest = null;
    }

    var ajax = view._pendingRequest = new Ajax({
        url: value,
        method: 'get',
        dataType: 'json',
        contentType: 'json'
    });
    ajax.on('success', function(event, data){
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
    });
    ajax.on('error', function(event, error){
        view.triggerActions('error', {error: error});
    });
    ajax.on('complete', function(){
        view.triggerActions('complete');
        view._pendingRequest = null;
    });

    ajax.send();
});

module.exports = Frame;