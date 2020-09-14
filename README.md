# Express Passport Google Auth Template

Implements [Google Auth using Passport](http://www.passportjs.org/docs/google/).

## Getting Started

Open the [Google Developer Console](https://console.cloud.google.com/) and register a project.

Go to APIs & Services.

Enable the APIs you require. This example uses the YouTube API.

Setup the OAuth consent screen.
* Don't set an image yet. This will trigger the validation process which takes a long time.

Go to Credentials and Create an OAuth Client ID.
* Set Authorised JavaScript origins to http://localhost:3000
* Set Authorised redirect URIs to http://localhost:3000/oauth/callback
* Make a note of the Client ID, Client Secret and Redirect URL.
* Set the following environment variables: OAUTH_CLIENT_ID, OAUTH_CLIENT_SECRET, OAUTH_REDIRECT_UR

We will store the user object (access token) in the session.
* Set the following environment variable: SESSION_SECRET
