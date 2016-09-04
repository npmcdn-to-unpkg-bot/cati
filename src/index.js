import {Component, View} from 'angular2/core';
import {bootstrap} from 'angular2/platform/browser';
import {Cati} from 'cati';

@Component({
  selector: 'main'
})

@View({
  directives: [Cati],
  template: `
    <cati></cati>
  `
})

class Main {

}

bootstrap(Main);
