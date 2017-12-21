import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'readablePhone'
})
export class ReadablePhonePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    const trimmed = ('' + value).replace(/\D/g, '');
    if (trimmed.length !== 10) { return 'N/A'; }
    const threeSets = trimmed.match(/^(\d{3})(\d{3})(\d{4})$/);
    return (!threeSets) ? value : '(' + threeSets[1] + ') ' + threeSets[2] + '-' + threeSets[3];
  }

}
