import express,{ NextFunction, Request, Response, Router } from "express";
import Student from "../schema/Student";
import Professor from "../schema/Professor";
import { loggerInfo } from "../winston";
import apicache from "apicache";
import { check, validationResult } from "express-validator";
const cache = apicache.middleware;


class StudentController {
    public router :Router = express.Router();
   
    constructor() {
      this.intializeRoutes();
    }
   
    public intializeRoutes() {
        this.router.put('/newStudent',this.createNewStudent);
        this.router.delete('/deleteStudent',this.deleteStudent);
        this.router.put('/updateStudentData',this.updateStudentData);
        this.router.get('/findStudentId',this.findStudentId);
        this.router.get('/findStudentByName', this.findStudentByName);
        this.router.get('/findAllStudent',cache('5 minutes'), this.findAllStudent); // cache limit 5mit.
    }
    
    // 학생 도큐먼트 생성
    private createNewStudent = async (req: Request, res: Response, next:NextFunction) => {
        const { body : studentData} =req;
        if(req.body){
            await check("name").isString().isLength({max:20}).isLength({min:3}).withMessage("잘못된 이름 입력").run(req);
            await check("age").isInt().isLength({max:3}).withMessage("잘못된 나이 입력").run(req);
            await check("sex").isString().withMessage("잘못된 성별").run(req);
            // TO DO : validator에 kr-KR 이 업데이트 되지 않음. regex 사용으로 변경
            await check("phone").isMobilePhone("am-AM").withMessage("잘못된 번호 유형").run(req);
            const result = validationResult(req);

            if(!result.isEmpty()){
                return res.status(300).json({ errors: result.array() });
            }
            else{
                try { 
                    // const professorId = JSON.stringify(studentData.professor);
                    //console.log("FFFF",professorId)
                    if(await Professor.findById(studentData.professor) ===null ){
                        res.status(300).json({errors: "찾을 수 없는 교수정보"}).end()
                    }else{
                        await Student.create(studentData).then(
                            (data)=>{
                                loggerInfo(200,req.originalUrl, null);
                                res.json(data).status(200).end();
                        }
                    )}             
                } catch (error) {
                    console.log( error)
                }
            }
        }
    };
    private deleteStudent = async (req: Request, res: Response, next:NextFunction) => {
        const { body : studentData} =req;
        const studentId = studentData.id;
        if(studentId){
            try {
                await Student.deleteOne({_id:studentId}).then(
                    (data)=>{
                        loggerInfo(200,req.originalUrl, null);
                        res.json(data).status(200).end();
                    }
                )                
            } catch (error) {
                res.json({error:"삭제과정에서 문제 발생"}).status(200).end();
            }
        }
    };
    // TO DO : aggregate 메서드 사용으로 교체.
    private findStudentId = async (req: Request, res: Response, next:NextFunction) => {
        const { body : studentData} =req;
        const studentId = studentData.id;
        if(studentId){
            try {
                const sutdnetData = await Student.findById(studentId).then(
                    (data)=>{console.log(" ID : ",data)
                    res.json(data).status(200).end();
                });
            } catch (error) {
                next();
            }
        }
        res.status(200).end();
    };

    // 학생 도큐먼트 업데이트
    private updateStudentData = async (req: Request, res: Response) => {
        // 도큐먼트 생성과 동일한 validation
        await check("name").isString().isLength({max:20}).isLength({min:3}).withMessage("잘못된 이름 입력").run(req);
        await check("age").isInt().isLength({max:3}).withMessage("잘못된 나이 입력").run(req);
        await check("sex").isString().withMessage("잘못된 성별").run(req);
        await check("phone").isMobilePhone("am-AM").withMessage("잘못된 번호 유형").run(req);
        const result = validationResult(req);
        if(!result.isEmpty()){
            return res.status(300).json({ errors: result.array() });
        }
        const { body : studentData} =req;
        const studentId = studentData.id;
        console.log(studentData);
        if(studentId){
            try {
                const sutdnetData = await Student.update({_id:studentData.id},{
                    "name":studentData.name, phone: studentData.phone, "sex":studentData.sex, "age": studentData.age, "professor":studentData.professor
                }).then(
                    (data)=>{
                        loggerInfo(200, req.originalUrl);
                        res.json(data).status(200).end();
                });
            } catch (error) {
                res.json({error:" 학생 생성 실패"});
            }
        }
    };

    // 학생 도큐먼트에서 학생 검색.  {name:{$regex: studentName.name}}
    private findStudentByName = async(req: Request, res: Response,) => {
        const {body : studentName} = req;
        await Student.aggregate([
            {
                $match:{name:{$regex: studentName.name}}
            }
        ]).then(
            (data)=>{
                res.json(data).status(200).end();
            }
        )
    };
    // 도큐먼트 전체 READ
    private findAllStudent = async (req: Request, res: Response) => {
        const {body : data } = req;
        const newProfessor = await Student.aggregate([
            {
                $match: {
                    name:{$regex: ""}
                }
            }
        ]);
        
        res.status(200).json(newProfessor).end();
    }
  }
   
export default StudentController;
