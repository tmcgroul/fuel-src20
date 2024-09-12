module.exports = class Data1726159848555 {
    name = 'Data1726159848555'

    async up(db) {
        await db.query(`CREATE TABLE "asset" ("id" character varying NOT NULL, "contract_id" text NOT NULL, "sub_id" text NOT NULL, CONSTRAINT "PK_1209d107fe21482beaea51b745e" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_asset__id" ON "asset" (SUBSTRING(id, 0, 20))`)
    }

    async down(db) {
        await db.query(`DROP TABLE "asset"`)
        await db.query(`DROP INDEX "IDX_asset__id"`)
    }
}
