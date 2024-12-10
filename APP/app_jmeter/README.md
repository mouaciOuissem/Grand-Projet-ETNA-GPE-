# JMeter

```
rm -rf ${PWD}/html/*
rm -rf ${PWD}/logs/*
docker run --rm -v ${PWD}:/workspace swethapn14/repo_perf:JmeterLatest -n -t /workspace/snl_local_plan_only-gtw_login.jmx -l /workspace/logs/snl_10Vu.jtl -e -o /workspace/html/
```
