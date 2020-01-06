import { Pipe, PipeTransform } from '@angular/core';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Pipe({
    name: 'joyTranslate'
})
export class JoyrideTranslatePipe implements PipeTransform {
    transform(value: any, ...args: any[]) {
        return of('joy'+ value).pipe(delay(2000)
        );
    }
}
