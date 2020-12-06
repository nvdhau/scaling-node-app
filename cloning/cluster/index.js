const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const http = require('http');

if (cluster.isMaster) {
  console.log('this is the master process:', process.pid);
  for(let i=0; i<numCPUs; i++) {
    cluster.fork()
  }

  cluster.on('exit', worker => {
    console.log(`worker process ${worker.process.pid} had died`);
    // console.log(`# workers: ${Object.keys(cluster.workers).length}`);

    console.log('starting a new worker');
    cluster.fork();
  });

}else {
  console.log('started a worker process: ', process.pid)
  http.createServer((req, res) => {
    const message = `serving from worker ${process.pid} ...`;
    res.end(message);

    if(req.url === '/kill') {
      process.exit();
    } else {
      console.log(message);
    }
  }).listen(3000)
}