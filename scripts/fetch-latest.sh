#!/usr/bin/env bash

# A continuous fetch script to retrieve latest news every second
while true; do
  curl "http://134.175.124.210:8002/api/s?id=ithome&latest=true"
  sleep 1
done 