
/* global Module */

/* Magic Mirror
 * Module: MMM-ADOLastCommits
 *
 * By Jarupat Jisarojito
 * MIT Licensed.
 */

Module.register("MMM-ADOLastCommits", {
	defaults: {
		apiVersion: "5.1",
		instance: "",
		repositoryId: "",
		branch: "master",
		commitCount: 5,
		username: "",
		personalAccessToken: "",
		updateInterval: 3600 * 1000,
		retryDelay: 5000
	},

	requiresVersion: "2.1.0", // Required version of MagicMirror

	start: function() {
		var self = this;
		var dataRequest = null;
		var dataNotification = null;

		//Flag for check if module is loaded
		this.loaded = false;
		this.commits = [];

		// Schedule update timer.
		this.getData();
		setInterval(function() {
			self.updateDom();
		}, this.config.updateInterval);
	},

	/*
	 * getData
	 * function example return data and show it in the module wrapper
	 * get a URL request
	 *
	 */
	getData: function() {
		if (this.config.instance == "" || this.config.repositoryId == "") {
			Log.error("MMM-ADOLastCommits: Repository information not set!");
			return;
		}

		if (this.config.username == "" || this.config.personalAccessToken == "") {
			Log.error("MMM-ADOLastCommits: Credential not set!");
			return;
		}

		var self = this;
		var urlApi = this.config.instance + "/_apis/git/repositories/" + this.config.repositoryId +
			"/commits?searchCriteria.itemVersion.version=" + this.config.branch +
			"&searchCriteria.$top=" + this.config.commitCount +
			" &api-version=" + this.config.apiVersion;
		var retry = true;

		var dataRequest = new XMLHttpRequest();
		dataRequest.open("GET", urlApi, true);
		dataRequest.setRequestHeader("Authorization", "Basic " + btoa(this.config.username + ":" + this.config.personalAccessToken));
		dataRequest.onreadystatechange = function() {
			console.log(this.readyState);
			if (this.readyState === XMLHttpRequest.DONE) {
				console.log(this.status);
				if (this.status === 200) {
					self.processData(JSON.parse(this.response));
				} else if (this.status === 401) {
					self.updateDom(self.config.animationSpeed);
					Log.error(self.name, this.status);
					retry = false;
				} else {
					Log.error(self.name, "Could not load data.");
				}
				if (retry) {
					self.scheduleUpdate((self.loaded) ? -1 : self.config.retryDelay);
				}
			}
		};
		dataRequest.send();
	},

	/* scheduleUpdate()
	 * Schedule next update.
	 *
	 * argument delay number - Milliseconds before next update.
	 *  If empty, this.config.updateInterval is used.
	 */
	scheduleUpdate: function(delay) {
		var nextLoad = this.config.updateInterval;
		if (typeof delay !== "undefined" && delay >= 0) {
			nextLoad = delay;
		}
		nextLoad = nextLoad ;
		var self = this;
		setTimeout(function() {
			self.getData();
		}, nextLoad);
	},

	getDom: function() {
		if (this.config.instance == "" || this.config.repositoryId == "") {
			var wrapper = document.createElement("div");
			wrapper.innerHTML = "Please set the correct Azure DevOps repository in the config for module: " + this.name + ".";
			wrapper.className = "dimmed light small";
			return wrapper;
		}

		if (this.config.username == "" || this.config.personalAccessToken == "") {
			var wrapper = document.createElement("div");
			wrapper.innerHTML = "Please set the correct Azure DevOps credential in the config for module: " + this.name + ".";
			wrapper.className = "dimmed light small";
			return wrapper;
		}

		var table = document.createElement("table");
		table.className = "small";

		for (var commit of this.commits) {
			var row = document.createElement("tr");
			table.appendChild(row);

			var dateCell = document.createElement("td");
			dateCell.className = "date";
			dateCell.innerHTML = commit.date;
			row.appendChild(dateCell);

			var committerCell = document.createElement("td");
			committerCell.className = "committer";
			committerCell.innerHTML = commit.committer;
			row.appendChild(committerCell);

			var descriptionCell = document.createElement("td");
			descriptionCell.className = "description";
			descriptionCell.innerHTML = commit.description;
			row.appendChild(descriptionCell);
		}

		// Log.info(table);

		return table;
	},

	// Override getHeader method.
	getHeader: function() {
		return "Last " + this.config.commitCount + " commits for " + this.config.branch + " branch";
	},

	getScripts: function() {
		return [];
	},

	getStyles: function () {
		return [
			"MMM-ADOLastCommits.css",
		];
	},

	// Load translations files
	getTranslations: function() {
		return false;
	},

	processData: function(data) {
		this.commits  = [];

		for (var i = 0; i < data.count; i++) {
			var commit = data.value[i];
			var commitData = {
				date: moment(commit.committer.date).format("YY/MM/DD  HH:mm"),
				committer: commit.committer.name,
				description: commit.comment,
			};

			this.commits.push(commitData);
		}

		// Log.info(this.commits);

		this.loaded = true;
		this.updateDom(this.config.animationSpeed);
	},
});
