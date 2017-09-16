
// Scripts/test.js


// Super Class.
var Super = function()
{
  this.makeUiid = function() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (d + Math.random()*16)%16 | 0;
      d = Math.floor(d/16);
      return (c=='x' ? r : (r&0x7|0x8)).toString(16);
    });
    return uuid;
  };
  this.shorthands = function() {
    if(this.tagName && !this.el) {
      this.$el = $('<'+this.tagName+'/>');
      this.el = $(this.$el)[0];
    }
    if (typeof this.el === 'string' || typeof this.el === 'object') {
      /**
       * Creates shortcuts for
       *  - The HTMLelement: el
       *  - And the JQuery element: $el.
       */
      this.el = $(this.el)[0];
      this.$el = $(this.el);
    }
  };
  this.parseRole = function(string) {
    var tmp =[];
    tmp = string.split(':');
    if (tmp.length >=1) {
      return {
        'eventType': tmp[0],
        'selector': tmp[1],
        'element': tmp[1] ? this.$el.find(tmp[1]) : this.$el
      };
    }
  };
  this.bindEvents = function() {
    if (this.events) {
      var module = this, element;
      _.each(this.events, function(value, key) {
        role = this.parseRole(key);
        if (role.eventType && role.element) {
          if (typeof this[value] == 'function') {
            if (this.$el === role.element) {
              $(role.element).unbind(role.eventType);

              // Event handler directly attached to the element.
              $(role.element).on(
                role.eventType,
                module[value].bind(module)
              );
            } else {
              $(role.element).undelegate(role.selector, role.eventType);

              // Event Handler delegation. Template insertion.
              this.$el.delegate(
                role.selector,
                role.eventType,
                module[value].bind(module)
              );
            }
          } else {
            throw TypeError(value+' is not '+typeof value);
          }
        }
      }, module);
    }
  };
  this.extend = function(obj) {
    var p, Clone;
    Clone = function(literal) {
      if (literal && typeof literal == 'object') {

        // Defines custom proterties @instantiation.
        var p;
        for(p in literal) {
          if (p === 'modele') {
            // Adds an uiid to the Modele.modele object.
            literal.modele.id = this.makeUiid();
            this[p] = literal.modele;
          } else {
            this[p] = literal[p];
          }
        }
      }

      // Methods triggered @ instantiation.
      this.shorthands();
      this.bindEvents();
      this.initialize();
    };

    // Clones mixins.
    for(p in this) {
      Clone.prototype[p] = this[p];
    }

    // Extends and overides Clone with the new obj.properties.
    for(p in obj) {
        Clone.prototype[p] = obj[p];
    }
    return Clone;
  };
};

// Pub/sub module.
var PubSub = function()
{
  /**
   * Singleton:
   * http://stackoverflow.com/questions/1479319/simplest-cleanest-way-to-implement-singleton-in-javascript?lq=1
   */
  if (PubSub._instance) {
    return PubSub._instance;
  }
  if (!(this instanceof PubSub)) {
    return new PubSub();
  }
  PubSub._instance = this;

  this.topics = [];
  this.listTopics = function() {
    var p;
    for(p in this.topics) {
      console.log('-> '+p+', callbacks: '+this.topics[p].length);
    }
    return this.topics;
  };
  this.subscribe = function(id, callback, params) {
    var obj;
    obj = {
      'callback': callback,
      'params': params
    };
    if(this.topics[id] !== undefined) {

      // TODO: check duplicate callbacks.
      this.topics[id].push(obj);
    } else {
      this.topics[id] = [obj];
    }
  };
  this.publish = function(id) {
    var i =0, callbacks, fct;
    callbacks = this.topics[id];
    if(callbacks && callbacks.length) {
      for(i=0;i<callbacks.length;i++) {
        if(typeof callbacks[i].callback == 'function') {
          params = callbacks[i].params;
          callbacks[i].callback.call(params);
        } else {
          throw TypeError(
            'subscriptions callback is '+
            typeof callbacks[i].callback
          );
        }
      }
    }
  };
  this.unsubscribe = function(id, callback) {
    if(callback && id) {
      var i =0, list, callbacks, fct;
      list = this.topics[id];
      for(i=0;i<list.length;i++) {
        fct = list[i].callback;
        if(fct === callback) {
          this.topics[id].splice(i, 1);
        }
      }
    }
  };
};

// Pub/sub module helpers.
var pubsub = new PubSub();
var subscribe = function(id, callback, params) {
  return pubsub.subscribe(id, callback, params);
};
var publish = function(id) {
  return pubsub.publish(id);
};

// Collection subclass.
var Collection = function()
{
  // Extends Super.
  Super.call(this);

  this.modele = null;
  this.store = [];
  this.length = function() {
    return this.store.length;
  };
  this.add = function(modele) {
    if (modele.length) {
      // List of modeles added.
      var i;
      for(i=0;i<modele.length;i++) {
        this.store.push(modele[i]);
      }
    } else {
      this.store.push(modele);
    }

    // Triggers event ‘collection:add’.
    publish('collection:add');
  };
  this.delete = function(modele) {
    var index = this.find(modele);
    if(index >=0 && this.store[index]) {
      this.store.splice(index, 1);
      publish('collection:delete');
    }
  };
  this.where = function(obj) {
     var i, p, item, res=[];
     for(i=0;i<this.store.length;i++) {
       var chk = true;
       item = this.store[i];
       for(p in obj) {
         if(item.modele.hasOwnProperty(p) !== true) {
           throw TypeError('Key: '+p+' not found.');
         } else {
           chk = (item.modele[p] === obj[p]);
           if(chk === false) {
             break;
           }
         }
       }
       if(chk) {
         res.push(item);
       }
     }
     return res;
  };
  this.find = function(modele) {
     var i, index =-1;
     for(i=0;i<this.store.length;i++) {
       if(this.store[i].get().id === modele.get().id) {
         return i;
       }
     }
  };
  this.modeles = function() {
    var i, length, res = [], elements;
    elements = this.all();
    length = elements.length;
    for(i=0; i<length; i++) {
      res.push(elements[i].get());
    }
    return res;
  };
  this.clear = function() {
    this.store = [];
    // Triggers event ‘collection:add’.
    publish('collection:delete');
  };
  this.all = function() {
    return this.store;
  };
  this.initialize = function() {
    // Default instantiation callback.
  };
};

// Modele subclass.
var Modele = function()
{
  // Extends Super.
  Super.call(this);

  this.defaults = {};
  this.modele = {};
  this.get = function() {
    return this.modele;
  };
  this.key = function(key) {
    var res ='';
    if (this.modele.hasOwnProperty(key)) {
      res = this.modele[key];
    }
    return res;
  };
  this.set = function(key, value) {
    this.modele[key] = value;
  };
  this.update = function(obj) {
    if (obj && typeof obj == 'object') {
      var key;
      for(key in obj) {
        if (this.modele.hasOwnProperty(key)) {
          this.set(key, obj[key]);
        }
      }
      publish('modele:update');
    }
  };
  this.initialize = function() {
    // Default instantiation callback.
  };
};

// View subclass.
var View = function()
{
  // Extends Super.
  Super.call(this);

  this.tagName = 'div';
  this.$el = null;
  this.el = null;
  this.modele = null;
  this.events = {};
  this.initialize = function() {
    // Default instantiation callback.
  };
};

var backboon = {};
backboon.collection = new Collection();
backboon.modele = new Modele();
backboon.view = new View();


