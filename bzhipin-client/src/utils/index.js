/*
包含n个工具函数的模块
 */
export function getRedirect(type, header){
  let path = '';
  if(type === 'boss'){
    path = '/boss';
  }else{
    path = 'student';
  }
  if(!header){
    path += 'info';
  }
  return path;
}