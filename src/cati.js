import {Component, View} from 'angular2/core';

@Component({
  selector: 'cati'
})

@View({
  templateUrl: 'cati.html'
})

export class Cati {

  constructor() {
    console.info('Cati Component Mounted Successfully');
  }

}
