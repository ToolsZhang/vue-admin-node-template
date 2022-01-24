import * as http from "@/utils/https";
import AuthJwt from "@/utils/auth";

// banner上传
export async function bannerUpload(file: any) {
    if (file){
        let param = new FormData(); // 创建form对象
        param.append("file", file, file.name); //对应后台接收图片名
        return await http.fetchFileUpload(`/fileuploads/banners`, param, {
            Authorization: "Bearer " + AuthJwt.jwt
        });
    } else return false;
}
// images上传
export async function imagesUpload(file: any) {
    if (file){
        let param = new FormData(); // 创建form对象
        param.append("file", file, file.name); //对应后台接收图片名
        return await http.fetchFileUpload(`/fileuploads/images`, param, {
            Authorization: "Bearer " + AuthJwt.jwt
        });
    } else return false;
}