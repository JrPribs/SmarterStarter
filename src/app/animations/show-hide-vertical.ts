import {
  animate, style, transition, trigger
} from '@angular/animations';

export const showHideVertical = (duration = '500') => trigger('showHideVertical', [ transition(':enter', [ style({ height: '0px' }), animate(`${duration}ms`, style({ height: '*' })) ]), transition(':leave', [ animate(`${duration}ms`, style({ height: '0px' })) ]) ]);
