@echo off

call npm install
call bower install --config.interactive=false
rem call ember build --environment=production