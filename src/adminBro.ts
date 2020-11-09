import AdminBro from 'admin-bro';
import Professor from "./schema/Professor";
// import AdminBroExpress from '@admin-bro/express'
const AdminBroExpress = require('@admin-bro/express')
const AdminBroMongoose = require('@admin-bro/mongoose')
// adminbro에 mongoose를 전체 등록.
// 1. 전체 리소스를 등록하는방법, 2. 특정한 리소스를 등록하는 방법.으로 나뉘어짐.
const AdminBroConnector = AdminBro.registerAdapter(AdminBroMongoose)

const schemaOption = {
    resources: [Professor],
}
const adminBro = new AdminBro(schemaOption)

const adminBroObj = new AdminBro({
    databases: [],
    rootPath: '/admin',
})

export const adminBroRouter = AdminBroExpress.buildRouter(adminBro)