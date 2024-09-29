

STEP = "0"
goto:
	cp "sst.config-step-$(STEP).ts" "sst.config.ts"

dev:
	./node_modules/.bin/sst dev --stage development

deploy:
	./node_modules/.bin/sst deploy --stage production

remove: 
	./node_modules/.bin/sst remove --stage development