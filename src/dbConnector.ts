import mongoose from "mongoose";
import { logger } from "./winston";
export const LocalDBConnector = async() =>{
    const dbUrl :string= process.env.DB_URL_FOR_LOCAL || "";
    try{
        await mongoose.connect(dbUrl,{useNewUrlParser: true}, (error) => {
        if (error) {
            logger.error('Local DB Connect error : ', error);
        } else {
            logger.info('MONGO DB CONNECTED ✅');
        }
        });
    }catch(error){
        logger.error('Local DB Connect error : ', error);
    }
}
export const httpDBConnector =() => {
    logger.info("프로덕션 환경에서의 DB연결 분기처리")
}