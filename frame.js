var Gaffa = require('gaffa'),
    crel = require('crel'),
    statham = require('statham'),
    Ajax = require('simple-ajax');

var viewCache = {};

function Frame(){}
Frame = Gaffa.createSpec(Frame, Gaffa.ContainerView);
Frame.prototype._type = 'frame';

Frame.prototype.render = function(){
    var renderedElement = crel(this.tagName || 'div');

    this.views.content.element = renderedElement;

    this.renderedElement = renderedElement;
};
Frame.prototype._requestData = function(url, callback){
    if(url == null){
        return;
    }

    if(this._pendingRequest){
        this._pendingRequest.request.abort();
        this._pendingRequest = null;
    }

    var ajax = this._pendingRequest = new Ajax({
        url: url,
        method: 'get',
        dataType: 'json',
        contentType: 'json'
    });
    ajax.on('success', function(event, data){
        callback(null, data);
    });
    ajax.on('error', function(event, error){
        callback({error: error});
    });
    ajax.on('complete', function(){
        this._pendingRequest = null;
    });

    ajax.send();
};
Frame.prototype._error = function(error){
    view.triggerActions('error', {error: error});
};
Frame.prototype._load = function(data){
    var gaffa = this.gaffa;
    
    if(this._loadedView){
        this._loadedView.remove();
        this._loadedView = null;
    }

    if(!data){
        this._error('No view was found');
        return;
    }

    var child = gaffa.initialiseView(statham.revive(data));
    this._loadedView = child;
    this.views.content.abortDeferredAdd();
    this.views.content.add(child);
    this.triggerActions('success');
    this.triggerActions('complete');
};
Frame.prototype.url = new Gaffa.Property(function(view, value){
    if(!viewCache[value] || !view.cache.value){
        view._requestData(value, function(error, data){
            if(error){
                view._error(error);
                return;
            }

            viewCache[value] = data;
            view._load(data);
        });
    }else{
        view._load(viewCache[value]);
    }
});
Frame.prototype.cache = new Gaffa.Property({
    value: true
});

module.exports = Frame;