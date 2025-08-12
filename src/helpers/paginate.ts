export class Paginate {
    static readonly ITEMS_PER_PAGE: number = 100
    totalPages: number
    currentPage: number

    constructor(readonly totalItems: number, currentPage: number) {
        this.currentPage = currentPage
        this.totalPages = Math.ceil(totalItems / Paginate.ITEMS_PER_PAGE)
    }

    nextPage(): number {
        if (this.currentPage < this.totalPages) {
            this.currentPage++
        }
        this.currentPage = this.totalPages
        return this.currentPage
    }
}