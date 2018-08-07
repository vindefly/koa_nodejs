import voxLogs from "../../libs/voxLogs";

export default function () {
    return {
        init(){
            voxLogs.logs();
            console.log(111);
        },
        render(){

        }
    }
}