# titactripJusitfyApi

## Description

REST API to justify a text in node JS typescript

## VS Code configuration

Using winston for logging, VS Code does not show logs from `std` by default. For this, you must add the following line in the launch configuration of your project: `"outputCapture": "std"`

# Installation

npm install
npm start

# DOCUMENTATION

```
/api/token
```

- return a token with a json body `{"email": "foo@bar.com"}`
- create the user if he doesn't exist

```
/api/justify
```

Justify a text pass in the body with a ContentType `text/plain`

```
/api/help
```

- You can find more details about the documentation
