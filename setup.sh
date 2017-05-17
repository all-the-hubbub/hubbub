#!/bin/bash
echo "fetching project configuration, wait for it..."
WEB_CONFIG=$(firebase setup:web)

# grab attributes from the web config
ATTRS=$(echo "$WEB_CONFIG" | perl -ne 'print if (/{/../}/)' | sed '1d' | sed '$d' | sed  's/^/  /')

# find the project id
PROJECT_ID=`echo $ATTRS | sed 's/.*"projectId": "\(.*\)".*/\1/'`
echo "ProjectId=$PROJECT_ID"

# generate the dev environment file for Angular web app
cat > webapp/src/environments/environment.ts <<EOS
export const environment = {
  production: false,
  name: 'dev',
  config: {
$ATTRS,
    "functionRoot": "https://us-central1-$PROJECT_ID.cloudfunctions.net",
  }
};
EOS


cat webapp/src/environments/environment.ts

echo "configuration written to: webapp/src/environments/environment.ts"