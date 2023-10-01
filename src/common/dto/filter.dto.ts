export type FilterOperator =
    | '>='
    | '<='
    | '<'
    | '>'
    | '!='
    | '='
    | 'ILIKE'
    | 'IN';
export class FilterDto {
    field: string;
    operator: FilterOperator;
    value: string | string[];

    constructor(field: string, operator: string, value: string) {
        this.field = field;
        if (operator === '~') {
            operator = 'ILIKE';
        }
        if (operator === '^') {
            operator = 'IN';
            this.value = value.split(',');
        } else {
            this.value = value;
        }
        this.operator = operator as FilterOperator;
    }
}
