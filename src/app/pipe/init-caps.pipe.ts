import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'initCaps'
})
export class InitCapsPipe implements PipeTransform {

  transform(value: string, args?: any): any {
    if (value === null) { return 'N/A'; }
    return ('' + value).replace(/(?:^|\s)[a-z]/g, char => char.toUpperCase());
  }

}
