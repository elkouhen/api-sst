

STEP = "0"
goto:
	cp "sst.config-step-$(STEP).ts" "sst.config.ts"

run: 
	./node_modules/.bin/sst dev

deploy: 
	./node_modules/.bin/sst deploy

remove: 
	./node_modules/.bin/sst remove