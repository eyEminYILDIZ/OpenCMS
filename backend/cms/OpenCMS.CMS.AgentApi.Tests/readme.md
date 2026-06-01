# Testing

Make sure you installed K6 on the system.

## Load Testing

Expected to run in normal conditions.

To run load testing:
```sh
k6 run load_test.ts
```

To run via web ui:
```sh
K6_WEB_DASHBOARD=true K6_WEB_DASHBOARD_OPEN=true k6 run load_test.ts
```

To run for just reporting html:
```sh
K6_WEB_DASHBOARD=true K6_WEB_DASHBOARD_EXPORT=report.html k6 run load_test.ts
```


## Stress Testing

Expected to break at some point.

To run stress testing:
```sh
k6 run stress_test.ts
```

To run via web ui:
```sh
K6_WEB_DASHBOARD=true K6_WEB_DASHBOARD_OPEN=true k6 run stress_test.ts
```


To run for just reporting html:
```sh
K6_WEB_DASHBOARD=true K6_WEB_DASHBOARD_EXPORT=report.html k6 run stress_test.ts
```