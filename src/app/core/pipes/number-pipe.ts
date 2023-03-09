import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'numberPipe'
})

export class NumberPipe implements PipeTransform {
    transform(value: any, args?: any): any {
        return new Intl.NumberFormat().format(value);
    }
}