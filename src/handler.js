const { nanoid } = require('nanoid')
const notes = require('./notes')

// memuat function handler yang akan digunakan nanti
const addNoteHandler = (request, h) => {
  // user mengirim payload tittle, tags & isi(body)
  const { title, tags, body } = request.payload

  // membuat custom id dengan menggunakan library nanoid
  const id = nanoid(16)
  const createdAt = new Date().toISOString()
  const updatedAt = createdAt

  // masukkan nilai object note dengan metode push
  const newNote = {
    title, tags, body, id, createdAt, updatedAt
  }

  notes.push(newNote)

  // filter untuk memastikan note sudah masuk atau tidak
  const isSuccess = notes.filter((note) => note.id === id).length > 0

  // cek response apakah berhasil atau tidak
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil ditambahkan',
      data: {
        noteId: id
      }
    })
    response.code(201)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Catatan gagal ditambahkan'
  })
  response.code(500)
  return response
}

const getAllNotesHandles = () => ({
  status: 'success',
  data: {
    notes
  }
})

const getNoteByIdHandler = (request, h) => {
  const { id } = request.params
  // gunakan array filter untuk mendapatkan note spesifik by id

  const note = notes.filter((n) => n.id === id)[0]
  // handle response filter
  if (note !== undefined) {
    return {
      status: 'success',
      data: {
        note
      }
    }
  }

  const response = h.response({
    status: 'fail',
    message: 'Catatan tidak ditemukan'
  })

  response.code(404)
  return response
}

const editNoteByIdHandler = (request, h) => {
  const { id } = request.params

  const { title, tags, body } = request.payload

  // memperbaharui waktu update
  const updatedAt = new Date().toISOString()

  const index = notes.findIndex((note) => note.id === id)
  // cek apakah index valid atau tidak

  // jika tidak ditemukan bernilai -1

  /**
   * ... (Spread operator) digunakan untuk mempertahankan nilai notes[index] yang tidak perlu diubah
   */

  if (index !== -1) {
    notes[index] = {
      ...notes[index],
      title,
      tags,
      body,
      updatedAt
    }

    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil diperbaharui'
    })
    response.code(200)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbaharui catatan. Id tidak ditemukan'
  })
  response.code(404)
  return response
}

const deleteNoteByIdHandler = (request, h) => {
  const { id } = request.params

  const index = notes.findIndex((note) => note.id === id)
  // menghapus array dengan metode splice
  if (index !== -1) {
    notes.splice(index, 1)
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil dihapus'
    })
    response.code(200)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Catatan gagal dihapus. Id tidak ditemukan'
  })
  response.code(404)
  return response
}

module.exports = {
  addNoteHandler,
  getAllNotesHandles,
  getNoteByIdHandler,
  editNoteByIdHandler,
  deleteNoteByIdHandler
}
