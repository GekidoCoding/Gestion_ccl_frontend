import { CalendarDateFormatter, DateFormatterParams } from 'angular-calendar';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Injectable } from '@angular/core';

@Injectable()
export class CustomDateFormatter extends CalendarDateFormatter {

    override weekViewHour({ date, locale }: DateFormatterParams): string {
        return format(date, 'HH\'h\'', { locale: fr });
    }

    override dayViewHour({ date, locale }: DateFormatterParams): string {
        return format(date, 'HH\'h\'', { locale: fr });
    }
}
