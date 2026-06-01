/////////////////////////////////////////////////////////////////////////////////
////////////////////// K6 LOAD TESTING //////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////

import http, { RefinedResponse, ResponseType } from "k6/http";
import { check, sleep } from "k6";
import { Options } from "k6/options";

export const options: Options = {
    thresholds: {
        // Assert that 99% of requests finish within 5.000ms.
        http_req_duration: ["p(99) < 5000"],
    },
    // Ramp the number of virtual users up and down
    stages: [
        { duration: "10s", target: 1000 },
        { duration: "30s", target: 5000 },
        { duration: "30s", target: 10000 },
        { duration: "30s", target: 100000 },
        { duration: "30s", target: 5000 },
        { duration: "10s", target: 0 },
    ],
};

// Simulated user behavior
export default function (): void {
    const res: RefinedResponse<ResponseType> = http.get("http://localhost:5010/assets");
    // Validate response status
    check(res, { "status was 200": (r) => r.status === 200 });
    sleep(1);
}
