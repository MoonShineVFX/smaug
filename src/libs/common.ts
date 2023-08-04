// db init usage
export const permission = [
  ['CATEGORY_CREATE', '建立分類'],
  ['CATEGORY_UPDATE', '更新分類'],
  ['CATEGORY_DELETE', '刪除分類'],
  ['ASSET_CREATE', '建立資源'],
  ['ASSET_UPDATE', '更新資源'],
  ['ASSET_DELETE', '刪除資源'],
  ['ASSET_DOWNLOAD', '下載資源'],
  ['TAG_CREATE', '建立標籤'],
  ['TAG_UPDATE', '更新標籤'],
  ['TAG_DELETE', '刪除標籤'],
]


export const rolesData = [{
  roleName: 'Admin',
  permissions: ['CATEGORY_CREATE', 'CATEGORY_UPDATE', 'CATEGORY_DELETE', 'ASSET_CREATE', 'ASSET_UPDATE', 'ASSET_DELETE', 'ASSET_DOWNLOAD', 'TAG_CREATE', 'TAG_UPDATE', 'TAG_DELETE']
},
{
  roleName: 'Creator',
  permissions: ['ASSET_CREATE', 'ASSET_UPDATE', 'ASSET_DELETE', 'ASSET_DOWNLOAD', 'TAG_CREATE', 'TAG_UPDATE', 'TAG_DELETE']

},
{
  roleName: 'User',
  permissions: ['ASSET_DOWNLOAD', 'TAG_CREATE', 'TAG_UPDATE', 'TAG_DELETE']
}]

export const settings = {
  SALT_ROUNDS: process.env.SALT_ROUNDS,
  TOKEN_PER_USER: Number(process.env.TOKEN_PER_USER),
  TOKEN_EXPIRE_TIME: process.env.TOKEN_EXPIRE_TIME,
}


export const representationJsonSchema = {
  preview: {},
  render: {
    "$schema": "https://json-schema.org/draft/2020-12/schema#",
    "$id": "https:/smaug.moonshine.tw/representation-render.json",
    "type": "object",
    "properties": {
      "render size": {
        "type": "array",
        "items": [
          {
            "type": "integer"
          },
          {
            "type": "integer"
          }
        ]
      },
      "renderer": {
        "type": "string"
      }
    },
    "required": [
      "render size",
      "renderer"
    ]
  },
  model: {
    "$schema": "https://json-schema.org/draft/2020-12/schema#",
    "$id": "https:/smaug.moonshine.tw/representation-model.json",
    "type": "object",
    "properties": {
      "vertext count": {
        "type": "integer"
      },
      "face count": {
        "type": "integer"
      },
      "bone count": {
        "type": "integer"
      },
      "texture count": {
        "type": "integer"
      }
    },
    "required": [
      "vertext count",
      "face count",
      "bone count",
      "texture count"
    ]
  },
  texture: {
    "$schema": "https://json-schema.org/draft/2020-12/schema#",
    "$id": "https:/smaug.moonshine.tw/representation-texture.json",
    "type": "object",
    "properties": {
      "texture size": {
        "type": "integer"
      },
      "texture format": {
        "type": "string"
      }
    },
    "required": [
      "texture size"
    ]
  },
}



