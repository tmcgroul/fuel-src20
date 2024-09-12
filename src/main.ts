import {run} from '@subsquid/batch-processor'
import {augmentBlock} from '@subsquid/fuel-objects'
import {DataSourceBuilder} from '@subsquid/fuel-stream'
import {Store, TypeormDatabase} from '@subsquid/typeorm-store'
import {assertNotNull} from '@subsquid/util-internal'
import {createAssetId} from 'fuels'
import {Asset} from './model'


const dataSource = new DataSourceBuilder()
    .setGateway('https://v2.archive.subsquid.io/network/fuel-testnet')
    .setGraphql({
        url: 'https://testnet.fuel.network/v1/graphql',
        strideConcurrency: 3,
        strideSize: 50
    })
    .setFields({
        receipt: {
            receiptType: true,
            contract: true,
            subId: true
        },
        transaction: {
            status: true
        }
    })
    .addReceipt({
        type: ['MINT'],
        transaction: true
    })
    .build()

const database = new TypeormDatabase()

run(dataSource, database, async ctx => {
    let blocks = ctx.blocks.map(augmentBlock)

    let assets: Map<string, Asset> = new Map()

    for (let block of blocks) {
        for (let receipt of block.receipts) {
            let tx = receipt.getTransaction()
            if (receipt.receiptType == 'MINT' && tx.status.type == 'SuccessStatus') {
                let contractId = assertNotNull(receipt.contract)
                let subId = assertNotNull(receipt.subId)
                let assetId = createAssetId(contractId, subId)

                let asset = await lookupAsset(ctx.store, assets, assetId.bits)
                if (asset) {
                    // asset was already created. skipping
                    continue
                }

                asset = new Asset({
                    id: assetId.bits,
                    contractId,
                    subId
                })
                assets.set(asset.id, asset)
            }
        }
    }

    await ctx.store.insert([...assets.values()])
})


async function lookupAsset(store: Store, assets: Map<string, Asset>, id: string) {
    let asset = assets.get(id)
    if (asset == null) {
        asset = await store.get(Asset, id)
    }
    return asset
}
