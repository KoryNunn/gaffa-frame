# gaffa-frame

frame view for loading UI into a [gaffa](https://github.com/gaffa-tape/gaffa-js) application

## Install:

    npm i gaffa-frame

## Add to gaffa:

    gaffa.registerConstructor(require('gaffa-frame'));

# API

## Properties (instanceof Gaffa.Property)

### url (get)

Where to get the serialised gaffa view.

the view should be serialised as described [here](https://github.com/gaffa-tape/gaffa-js/wiki/Stringifying-ViewItems)