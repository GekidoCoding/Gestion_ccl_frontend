export class Monthutil {
    private static months: string[] = [
        "Janvier", "Février", "Mars", "Avril",
        "Mai", "Juin", "Juillet", "Août",
        "Septembre", "Octobre", "Novembre", "Décembre"
    ];

    public static toMonthString(viewDate: Date): string {
        const month: number = viewDate.getMonth();
        const year: number = viewDate.getFullYear();
        return this.months[month] + " " + year;
    }
}
