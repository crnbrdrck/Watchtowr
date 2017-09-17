# README

Below is the overview of the different systems that make up Watchtowr.

## Cymon API

We make calls to the **Cymon API** with term queries using an AJAX GET request.

These API calls give us the latest files in last 30 days that match our search criterion.

We are currently searching for Apache, MySQL and Ubuntu since these are major components of LAMP stack and can have vulnerabilities.

Cymon returs a series of 10 reports as a JSON object, which we parse to extract version information, timestamps and location info.

***

## Firebase
The entire webapp lives and operates off of Google's *Firebase*.

The major features we use are the
- Databases
- Cloud Functions
- Hosting which we use to display the HTML pages and serve the code.

The databases are written to directly using the firebase.database.push method.

We currently keep the following databases:
- Threats
  - Processed Cymon calls live here.
- Issues
  - Threats that have been associated with a server 
- Servers
  - Active user systems with unique IDs and version/location information
- Users
  - Assigned unique IDs and have emails to communicate

We also have the following Cloud Functions
- ServerUpdate
  - Watches databases for updates and initiates version comparisons. 
- Mail
  - Informs a user by email if their server(s) have a vulnerability
***

# Server Daemon
Our pride and joy is our Watchtowr Daemon. This is a service that is installed directly on users' servers, and it reports the current configuration of the server every 30 minutes.

This daemon will also be able to improve the lives of our users by possibly allowing them to fix problems on their servers remotely.

On receiving an Issue in their server, we plan to allow the user to fix them remotely but invoking the powers of our lovable little daemon
