

STEP=0
PASSWORD=default
goto:
	cp "sst.config-step-$(STEP).ts" "sst.config.ts"

dev:
	./node_modules/.bin/sst dev --stage development

deploy:
	./node_modules/.bin/sst deploy --stage production

remove: 
	./node_modules/.bin/sst remove --stage development

set-password:
	aws cognito-idp admin-set-user-password --user-pool-id us-east-1_MTa0qhtBF --username mehdi.elkouhen@wescale.fr --password ${PASSWORD} --permanent


initiate-auth:
	aws cognito-idp initiate-auth --auth-flow USER_PASSWORD_AUTH --client-id 5dts0rluml1nktgp7d5unptk5c --auth-parameters USERNAME=mehdi.elkouhen@wescale.fr,PASSWORD=${PASSWORD}