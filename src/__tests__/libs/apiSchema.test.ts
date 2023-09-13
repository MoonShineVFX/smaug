import { assetCreateSchema } from '../../libs/apiSchema'

describe('API Schema', () => {
    test('Asset Create Schema', async ()=>{
        const expect1 = {
            name: "Fish 001",
            categoryId: 4,
            tags: ["tag1", "tag2"]
        }
        const praseAssetParam = assetCreateSchema.parse(expect1)
        console.log(praseAssetParam)
        expect(praseAssetParam).toEqual(expect1)
    })

    test('Asset Create Schema with wrong type', async ()=>{
        const expect1 = {
            name: "Fish 001",
            categoryId: "4",
            tags: ["tag1", "tag2"]
        }
        expect(() => assetCreateSchema.parse(expect1)).toThrow()
    })
})