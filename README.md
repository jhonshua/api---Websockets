# api---Websockets

## to start the project

npm start

## routes

post '/login'
Request body
application/json
{,
"username":"Juan-Pablo",
"password":"1316jkljk616"

}

Responses
code 200
application/json
{
id: foundUser.\_id,
message: 'logged in session'
}

code 400 'pass error'

code 400 'user no found'

---

post '/logout'

Request body
application/json
{,
"username":"Juan-Pablo",
"password":"1316jkljk616"

}

Responses
code 200
application/json
{
ok,

}

get '/messages/:userId'
post '/register'
get '/profile'
get '/people'
