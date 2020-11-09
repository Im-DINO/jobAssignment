import mongoose from "mongoose";
import { logger } from "./winston";

import AdminBro from 'admin-bro';
const AdminBroExpress = require('@admin-bro/express')
const AdminBroMongoose = require('@admin-bro/mongoose')
import Professor from './schema/Professor'
// adminbro에 mongoose를 전체 등록.
AdminBro.registerAdapter(AdminBroMongoose)

export const LocalDBConnector = async () => {
    const dbUrl: string = 'mongodb+srv://dino:dino@assignmentproject.ohdci.gcp.mongodb.net/assignmentproject?retryWrites=true&w=majority' || "";
    try {
        const tee = await mongoose.connect(dbUrl, { useNewUrlParser: true }, (error) => {
            if (error) {
                logger.error('Local DB Connect error : ', error);
            } else {
                logger.info('MONGO DB CONNECTED ✅');
            }
        });
        console.log("@@@", tee)
    } catch (error) {
        logger.error('Local DB Connect error : ', error);
    }
}
export const httpDBConnector = () => {
    logger.info("프로덕션 환경에서의 DB연결 분기처리")
}
const adminBroOptions = {
    //databases: [mongooseDb],
    resources: [{ Professor }],
}
const adminBroObj = new AdminBro(adminBroOptions);

export const router = AdminBroExpress.buildRouter(adminBroObj)




