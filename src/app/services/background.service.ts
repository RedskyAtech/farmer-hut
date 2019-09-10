import { HTTP } from "./http.service";

@JavaProxy("com.tns.BackgroundService")
export class BackgroundService extends android.app.Service {

    private http: any;

    constructor() {
        super()
    }


    public onBind(intent: android.content.Intent): android.os.IBinder {
        return null;
    }

    public onStartCommand(intent: android.content.Intent, flags: number, startId: number): number {

        this.http = HTTP.http;

        this.http.get("http://ec2-13-229-228-92.ap-southeast-1.compute.amazonaws.com:3000/api/users").subscribe((res: any) => {
            console.log('RES:::', res)
        }, error => {
            console.log('EEERES:::', error);
        })
        return 0;
    }

}