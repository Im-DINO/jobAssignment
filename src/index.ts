import App from "./app";
import cluster from "cluster";
import dotenv from "dotenv";
import { logger } from "./winston";

dotenv.config();

// 서버 시동 후, 강제 셧다운. Node Cluster를 사용한 서버 리부팅
if(cluster.isMaster){
    const worker =cluster.fork();
    logger.info(" Server Started.")
    
      setTimeout(() => {
        worker.kill();
        console.log("*** Server Forceed ShutDown.")
      }, 5000);
    
    cluster.on('exit', (worker, code, signal) => {
       logger.warn(`SERVER SHUT DOWNED. SERVER RESTARTED...`)
       // true 조건 제거시, cluster가 우발적인 종료에만 리부팅.  
        if (true || worker.exitedAfterDisconnect === false) {
            console.error(`Node cluster worker ${worker.process.pid} exited: code ${code}, signal ${signal}`);
            cluster.fork();
          }
      });
}else if (cluster.isWorker){
  const app = new App(
    3000,
  );
  app.listen();
}
