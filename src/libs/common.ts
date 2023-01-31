export type UserInfo = {
    id: string;
    name: string;
    email: string;
    picture: string;
}

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