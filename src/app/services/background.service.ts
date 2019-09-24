import { HTTP } from "./http.service";
import { HttpClient } from "@angular/common/http/http";

@JavaProxy("com.tns.BackgroundService")
export class BackgroundService extends android.app.Service {

    private http: any;

    constructor() {
        super()
    }


    public onBind(intent: android.content.Intent): android.os.IBinder {
        return null;
    }

    public onCommand(intent: android.content.Intent, flags: number, startId: number, http: HttpClient, req: string, url: string, options?: any, body?: any): Promise<any> {
        super.onStartCommand(intent, flags, startId)

        var promise;

        switch (req) {
            case "GET":
                promise = new Promise<any>((resolve, reject) => {
                    http.get(url, options).subscribe((res: any) => {
                        console.log('RES::GET:', res)
                        resolve(res);
                        super.stopSelf();
                    }, error => {
                        console.log('EEERES::GET:', error);
                        reject(error);
                        super.stopSelf();
                    })
                });
                break;
            case "PUT":
                promise = new Promise<any>((resolve, reject) => {
                    http.put(url, body, options).subscribe((res: any) => {
                        console.log('RES::PUT:', res)
                        resolve(res);
                        super.stopSelf();
                    }, error => {
                        console.log('EEERES::PUT:', error);
                        reject(error);
                        super.stopSelf();
                    })
                })
                break;
            case "POST":
                promise = new Promise<any>((resolve, reject) => {
                    http.post(url, body, options).subscribe((res: any) => {
                        console.log('RES::POST:', res)
                        resolve(res);
                        super.stopSelf();
                    }, error => {
                        console.log('EEERES::POST:', error);
                        reject(error);
                        super.stopSelf();

                    })
                })
                break;
        }
        return promise;
    }

}