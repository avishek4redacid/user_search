import path from 'path'
import express from 'express'


//Creating express object host an api server
const app = express(),
            DIST_DIR = __dirname,
            HTML_FILE = path.join(DIST_DIR, 'index.html')
app.use(express.static(DIST_DIR))
app.use(express.json())

//Get Api to render UI
app.get('/', (req, res) => {
    res.sendFile(HTML_FILE)
})

//Startign the server
const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
    console.log(`App listening to ${PORT}....`)
    console.log('Press Ctrl+C to quit.')
})


