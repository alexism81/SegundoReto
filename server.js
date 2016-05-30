var Hapi = require('hapi'); 
var Vision = require('vision');
var Path = require('path');
var Request = require('request');
var server = new Hapi.Server();

server.connection({
    host: 'localhost',
    port: Number(process.argv[2] || 3000)
});

server.register(Vision, function(err) {
  if (err)  
    console.log("error register:", err);
});

//function(req,res) funciones que tienen acceso al
//objeto de solicitud(req)
//objeto de respuesto(res)

server.route({
    method: 'GET',
    path: '/',
    handler: function(req, res) {
        res.view('index')
    }
});
server.views({
    engines: {
        html: require('handlebars')
    },
    path: Path.join(__dirname, 'templates')
});


server.route({
    method: 'GET',
    path: '/{nombre}',
    handler: function(req, res) {

        var username = req.params.nombre;
        Request("http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=E33A9B303907C743C626F4E7C895A8D2&&vanityurl=" + req.params.nombre, 
                 function(error, response, body) {
            if (!error && response.statusCode == 200) {
                body = JSON.parse(body);
                var id = body.response.steamid;
                res.view('anexo', {
                    username: username,
                    id: id
                });
            }
        });


    }
});

server.start(() => {
    console.log('Servidor corriendo en:', server.info.uri);
});

