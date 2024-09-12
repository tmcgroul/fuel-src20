import {Entity, StringColumn, PrimaryColumn} from '@subsquid/typeorm-store'

@Entity()
export class Asset {
    constructor(props?: Partial<Asset>) {
        Object.assign(this, props)
    }

    @PrimaryColumn()
    id!: string

    @StringColumn()
    contractId!: string

    @StringColumn()
    subId!: string
}
