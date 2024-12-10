# rm -rf ${PWD}/html/*
# rm -rf ${PWD}/logs/*
# docker run --rm -v ${PWD}:/workspace swethapn14/repo_perf:JmeterLatest -n -t /workspace/snl_local_plan.jmx -l /workspace/logs/snl_10Vu.jtl -e -o /workspace/html/

# -e JVM_ARGS="-Jthreads=10 -Jrampup=20"