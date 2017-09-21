import mongoose from 'mongoose'
import { Mockgoose } from 'mockgoose'
import Promise from 'bluebird'
const { ObjectId } = mongoose.Schema.Types

mongoose.Promise = Promise

async function nullsAndUndefines() {
  const mockgoose = new Mockgoose(mongoose)
  await mockgoose.prepareStorage()

  await mongoose.connect('mongodb://localhost/db-mongoose-test', { useMongoClient: true })

  const AuthorSchema = new mongoose.Schema({
    first_name: { type: String },
    middle_name: { type: String },
    last_name: { type: String},
  })

  const AuthorModel = mongoose.model('Author', AuthorSchema)

  const a1 = new AuthorModel()
  a1.first_name = 'Dave'
  await a1.save()

  const a2 = new AuthorModel()
  a2.first_name = 'Mike'
  a2.last_name = 'Jones'
  await a2.save()

  const a3 = new AuthorModel()
  a2.first_name = 'Bob'
  a2.last_name = null
  await a2.save()

  const r1 = await AuthorModel.find({ last_name: null }).exec()
  console.log(JSON.stringify(r1))

  const r2 = await AuthorModel.find({ last_name: undefined }).exec()
  console.log(JSON.stringify(r2))
}

async function s2() {
  const mockgoose = new Mockgoose(mongoose)
  await mockgoose.prepareStorage()

  await mongoose.connect('mongodb://localhost/db-mongoose-test', { useMongoClient: true })

  const AuthorSchema = new mongoose.Schema({
    first_name: { type: String },
    middle_name: { type: String },
    last_name: { type: String},
  })

  const AuthorModel = mongoose.model('Author', AuthorSchema)

  const a1 = new AuthorModel()
  a1.first_name = 'Dave'
  await a1.save()

/*
  const a2 = new AuthorModel()
  a2.first_name = 'Mike'
  a2.last_name = 'Smith'
  await a2.save()

  const a3 = new AuthorModel()
  a2.first_name = 'Bob'
  a2.last_name = null
  await a2.save()
*/
  const r1 = await AuthorModel.find({}).exec()
  console.log(JSON.stringify(r1))
}

async function xxxsetup() {
  const mockgoose = new Mockgoose(mongoose)
  await mockgoose.prepareStorage()

  await mongoose.connect('mongodb://localhost/db-mongoose-test-gg', { useMongoClient: true })

  const AuthorSchema = new mongoose.Schema({
    first_name: { type: String },
    middle_name: { type: String },
    last_name: { type: String},
    book_ids: { type: [{ type: ObjectId, ref: 'Book' }] }
  }, { toObject: { virtuals: true }, toJSON: { virtuals: true } })

  AuthorSchema.virtual('books', {
    ref: 'Book',
    localField: 'book_ids',
    foreignField: '_id',
  })

  const AuthorModel = mongoose.model('Author', AuthorSchema)


  const BookSchema = new mongoose.Schema({
    title: { type: String }
  })
  const BookModel = mongoose.model('Book', BookSchema)

  const b1 = new BookModel()
  b1.title = 'b1'
  await b1.save()

  const b2 = new BookModel()
  b2.title = 'b2'
  await b2.save()

  const b3 = new BookModel()
  b3.title = 'b3'
  await b3.save()

  const a1 = new AuthorModel()
  a1.first_name = 'Dave'
  a1.book_ids = [b1, b2, b3]
  await a1.save()

  const r1 = await AuthorModel.find({}).populate('books').exec()
  console.log(JSON.stringify(r1))
  console.log(r1.books)
}

async function setup() {
  const mockgoose = new Mockgoose(mongoose)
  await mockgoose.prepareStorage()

  await mongoose.connect('mongodb://localhost/db-mongoose-test', { useMongoClient: true })

  const AuthorSchema = new mongoose.Schema({
    name: { type: String, index: true, unique: true },
    books: { type: [{ type: String}], index: true, unique: true }
  }, { toObject: { virtuals: true }, toJSON: { virtuals: true } })

  const AuthorModel = mongoose.model('Author', AuthorSchema)

  const a1 = new AuthorModel()

  await new Promise((resolve ) => {
    AuthorModel.on('index', (err) => { console.log(err); resolve() })
  })

  await Promise.delay(10)
  a1.name = 'Dave'
  a1.books = ['Dave', 'Dave']
  await a1.save()

  const a2 = new AuthorModel()
  a2.name = 'John'
  a2.books = ['Dave']
  await a2.save()

  const r1 = await AuthorModel.find({}).exec()
  console.log(JSON.stringify(r1, null, 2))

  console.log('done')
}

setup()
