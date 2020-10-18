import express, { Request,Response, Router } from "express";

// v2 버전 라우터
class v2Controller {
    public router :Router = express.Router();
    
    constructor(){
        this.initialize
    }
    initialize(){
        this.router.use('/',function(req:Request, res:Response){
            res.end();
        });
    }
};
export default v2Controller