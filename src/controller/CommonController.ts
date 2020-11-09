import express,{ Request, Response, Router } from "express";

class CommonController {
    public router :Router = express.Router();
   
    constructor() {
      this.intializeRoutes();
    }
   
    public intializeRoutes() {
        this.router.get('/test:ts', this.testController);
        this.router.get('/', this.getHome);
    }
    
    // Common Controllers
    private getHome = (req: Request, res: Response) => {
        res.status(200).send("Connected Home ").end();
    }
   
    private testController = (req: Request, res: Response)  => {
        console.log(req.query);

        res.status(200).send("Connected Test ").end();
      }
  }
   
export default CommonController;