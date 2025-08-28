export class Page<T> {
    public content!: T[];
    public totalElements!: number;
    public totalPages!: number;
    public number!: number;
}