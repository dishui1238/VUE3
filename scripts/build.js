/**
 * 把 package 目录下的索引包进行打包
 */

const fs = require("fs");
const execa = require('execa'); // 开启子进程 进行打包， 最终还是使用rollup来进行打包

// 同步读取 packages 下的所有目录，忽略文件，只保留文件夹
const targets = fs.readdirSync("packages").filter((f) => {
  if (!fs.statSync(`packages/${f}`).isDirectory()) {
    return false; // 不是目录
  }
  return true;
});

function runParallel(targets, iteratorFn) {
  const res = [];
  for (const item of targets) {
    const p = iteratorFn(item);
    res.push(p);
  }
}

async function build(target){ // rollup  -c --environment TARGET:shated
  await execa('rollup',['-c','--environment',`TARGET:${target}`],{stdio:'inherit'}); // 当子进程打包的信息共享给父进程
}

// 对目标依次打包，并行打包
runParallel(targets, build);

console.log(targets);
