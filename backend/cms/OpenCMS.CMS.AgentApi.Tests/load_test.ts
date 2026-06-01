/////////////////////////////////////////////////////////////////////////////////
////////////////////// K6 LOAD TESTING //////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////

import http, { RefinedResponse, ResponseType } from "k6/http";
import { check, sleep } from "k6";
import { Options } from "k6/options";

export const options: Options = {
    thresholds: {
        // Assert that 99% of requests finish within 3000ms.
        http_req_duration: ["p(99) < 3000"],
    },
    // Ramp the number of virtual users up and down
    stages: [
        { duration: "30s", target: 1000 },
        { duration: "1m", target: 5000 },
        { duration: "20s", target: 0 },
    ],
};

// Simulated user behavior
export default function (): void {
    const res: RefinedResponse<ResponseType> = http.get("http://localhost:5010/assets");
    // Validate response status
    check(res, { "status was 200": (r) => r.status === 200 });
    sleep(1);
}
