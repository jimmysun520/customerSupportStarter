import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortZip'
})
export class ShortZipPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    const trimmed = ('' + value).replace(/\D/g, '');
    if (trimmed.length < 5) { return 'N/A'; }
    return trimmed.slice(0, 5);
  }

}
