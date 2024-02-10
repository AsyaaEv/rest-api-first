const express = require('express')
const dotenv = require('dotenv')
const { PrismaClient } = require('@prisma/client')

const app = express()
const prisma = new PrismaClient()
dotenv.config()
const PORT = process.env.PORT
app.use(express.json())


app.get('/products', async (req, res) => {
    const products = await prisma.product.findMany()

    res.send(products)
})

app.get('/product/:id', async (req, res) => {
    const productId = req.params.id

    const products = await prisma.product.findFirst({
        where : {
            id : parseInt(productId)
        }
    })
    if(!products){
        return res.send("Product is not found")
    }

    res.send(products)
})

app.post('/products', async (req, res) => {
    const newProduct = req.body
    const product = await prisma.product.create({
        data: {
            name: newProduct.name,
            description: newProduct.description,
            price: newProduct.price,
            image: newProduct.image,
        }
    })

    res.send('Created Product Success')

})

app.delete('/product/:id', async (req, res) => {
    const id = req.params.id

    await prisma.product.delete({
        where: {
            id: parseInt(id)
        }
    })
    res.send('Deleted Product Success')
})

app.put('/product/:id', async (req, res) => {
    const idProduct = req.params.id
    const dataProduct = req.body
    if( !(dataProduct.name && dataProduct.description && dataProduct.price && dataProduct.image) ){
        return res.send('Some field are missing')
    }

    const product = await prisma.product.update({
        where: {
            id : parseInt(idProduct)
        },
        data : {
            name : dataProduct.name,
            description : dataProduct.description,
            price : dataProduct.price,
            image : dataProduct.image,
        }
    })
    res.send('Updated Product Success ')

    if(!product){
        return res.send("Product is not found")
    }
})

app.patch('/product/:id', async (req, res) => {
    const idProduct = req.params.id
    const dataProduct = req.body

    const product = await prisma.product.update({
        where: {
            id : parseInt(idProduct)
        },
        data : {
            name : dataProduct.name,
            description : dataProduct.description,
            price : dataProduct.price,
            image : dataProduct.image,
        }
    })
    res.send('Updated Product Success ')

})

app.listen(PORT, () => {
    console.log('Express API running in port: ' + PORT)
})