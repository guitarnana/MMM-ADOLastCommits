# AzureDevsOps

This is a module for the [MagicMirror²](https://github.com/MichMich/MagicMirror/).

MMM module to list the latest n git commits of Azure DevOps repository.

## Using the module

To use this module, add the following configuration block to the modules array in the `config/config.js` file:
```js
var config = {
    modules: [
        {
            module: "MMM-ADOLastCommits",
			position: "bottom_center",
			config: {
				instance: "", // The Azure DevOps Services organization
				repositoryId: "", // repository ID
				branch: "master",
				commitCount: "7",
				username: "", // User to connect to the repository
				personalAccessToken: "", // personal access token of the user
				updateInterval: 3600 * 1000, // update interval in milliseconds
			}
        }
    ]
}
```

## Configuration options

| Option           | Description
|----------------- |-----------
| `instance`        | *Required* Azure DevOps instance name. For more information see [here](https://docs.microsoft.com/en-us/rest/api/azure/devops/?view=azure-devops-rest-5.1#components-of-a-rest-api-requestresponse-pair)
| `repositoryId`        | *Required* Azure DevOps repository name. For more information see [here](https://docs.microsoft.com/en-us/rest/api/azure/devops/?view=azure-devops-rest-5.1#components-of-a-rest-api-requestresponse-pair)
| `username`        | *Required* User to connect to the repository.
| `personalAccessToken`        | *Required* Personal access token for the user.
| `branch`        | *Optional* branch name to fetch the last commits. <br><br>**Type:** `string` <br>Default master
| `commitCount`        | *Optional* Number of the commits to fetch. <br><br>**Type:** `int` <br>Default 7
| `updateInterval`        | *Optional* Update interval. <br><br>**Type:** `int`(milliseconds) <br>Default 3600 * 1000 milliseconds (1 hour)
