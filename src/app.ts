import express, { Application, NextFunction } from "express";
import CommonController from "./controller/CommonController";
import StudentController from "./controller/StudentController";
import {errorMiddleware} from "./errorHandler";
import createError from 'http-errors';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import {LocalDBConnector} from "./dbConnector";
import helmet from "helmet";
import { logger } from "./winston";
import ProfessorController from "./controller/ProfessorController";


class App {
  public app: Application | any;
  public port: number| any= 0;

  constructor(port:any) {
    this.app = express();
    this.port = port;
    this.initializeMiddlewares();
    this.initializeControllers();
    this.connectErrorHandler();
  };
 
  private initializeMiddlewares() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(cookieParser());
    this.app.use(session({
      secret: process.env.SESSION_SECRET_KEY || "",
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false, httpOnly: true },
    }));
    if((this.app.get('env')==="development")){
      LocalDBConnector();
    }
    this.app.use(helmet());
    this.app.use(helmet({
      expectCt:{
        enforce: true,
        maxAge: 123,},
        referrerPolicy: { policy: "no-referrer" },
    }));
  }
 
  private initializeControllers() {
      this.app.use('/', new CommonController().router);
      this.app.use('/student', new StudentController().router);
      this.app.use('/professor', new ProfessorController().router);
  }

  private connectErrorHandler(){
    // create 404 Error
    this.app.use(function(req:Request, res:Response, next:NextFunction) {
      next(createError(404));
    });
    // Error Handler
    this.app.use(errorMiddleware);
  }

  public listen() {
    this.app.listen(this.port, () => {
      logger.info(` App listening on the port ${this.port}`);
    });
  }

}
export default App;
