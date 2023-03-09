// code untuk menjalankan server http
const Hapi = require('@hapi/hapi')
const routes = require('./routes')

const init = async () => {
  const server = Hapi.server({
    port: 5000,
    host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
    routes: {
      cors: {
        origin: ['*']
      }
    }
  })
  // menambahkan CORS agar resource yang berbeda origin bisa diakses

  // memasukkan file route, bertujuan memanggil route saat server start
  server.route(routes)

  await server.start()
  console.log(`server berjalan pada ${server.info.uri}`)
}

init()
