import express,{ NextFunction, Request, Response, Router } from "express";
import Professor from "../schema/Professor";
import Mongoose from "mongoose";


export default class ProfessorController {
    public router :Router = express.Router();
   
    constructor() {
      this.intializeRoutes();
    }
   
    public intializeRoutes() {
        this.router.get('/createProfessor', this.createNewProfessor);
        this.router.get('/findAllProfessor', this.findAllProfessor);
        this.router.get('/findStudentInCharger', this.findStudentInCharger);
    }
    

    // 교수 도큐먼트 생성
    private createNewProfessor = async (req: Request, res: Response) => {
        const {body : professorData } = req;
        const newProfessor = await  Professor.create(professorData);
    }
    
    // 모든 교수 조회
    private findAllProfessor = async (req: Request, res: Response) => {
        const {body : data } = req;
        const newProfessor = await Professor.aggregate([
            {
                $match: {
                    name:{$regex: ""}
                }
            }
        ]);
        res.status(200).json(newProfessor).end();
    }

    // 교수 도큐먼트 조회 && join && age>23 && sex=man
    private findStudentInCharger = async (req: Request, res: Response) => {
        const {body : professor } = req;
        const PID:Mongoose.Types.ObjectId = new Mongoose.Types.ObjectId(professor.id);
        try {
            const newProfessor = await Professor.aggregate([
                {
                    $match: {
                        _id: PID
                    }
                },
                {
                    $lookup:{ 
                        from: 'Student', localField: '_id', foreignField: 'professor', as: 'students'
                 }
                },
                {
                    $project: { _id : 1, name : 1, students: {
                        $filter:{
                            input: "$students",
                            as: "student",
                            cond: {
                                $and: [
                                    {$eq: ["$$student.sex", "man"]},
                                    {$gt: ["$$student.age",23]},
                                  ]
                      
                            }
                        }
                    }}
                }
                
            ]);
            if(newProfessor){
                res.status(200).json(newProfessor).end();
            }else{
                res.status(300).json({error:"일치하는 데이터 없음."});
            }
                
        } catch (error) {
            res.status(300).end();
        }
        
    }
}