import express from 'express'


const app = express();




app.get('/ads', (req, res) => {
    res.send("acessou ads")
})


app.listen(3333);