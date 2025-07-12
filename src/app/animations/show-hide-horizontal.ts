import {
  animate, style, transition, trigger
} from '@angular/animations';

export const showHideHorizontal = (duration = '500') => trigger('showHideHorizontal', [ transition(':enter', [ style({ width: '0px' }), animate(`${duration}ms`, style({ width: '*' })) ]), transition(':leave', [ animate(`${duration}ms`, style({ width: '0px' })) ]) ]);
