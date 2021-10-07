const express = require('express');
const cors = require('cors');

const app = express();

class Server {

    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath = '/api/usuarios';
        //Middlewares = funciones para añadir funcionalidad al web server
        this.middlewares();
        //Rutas de mi aplicaciones
        this.routes();
    }

    middlewares(){
        //cors = para configurar que hagan las solicitudes sólo desde URLs determinadas
        this.app.use( cors() );

        //Lectura y parseo del body
        this.app.use( express.json() );

        //directorio publico
        this.app.use( express.static('public') );
    }
    
    routes(){
        this.app.use(this.usuariosPath, require('../routes/usuarios'));
    }

    listen(){
        this.app.listen( this.port, () => {
            console.log('Servidor corriendo en puerto ', this.port);
        });
    }

}

module.exports = Server;