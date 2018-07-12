// ===[ Deps ]========
const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const app = express()
const fs = require('fs')
const parser = require('xml2json')
const db = require('./ExpServFiles/knex')
const router = express.Router()
// const parseString = require('xml2js').parseString;
// const axios = require('axios')





// ===[ MIDDLEWARE ]=================================
app.use(express.static(path.join(__dirname, 'build')))
app.use(require('./ExpServFiles/headers'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())






// ===[ Routes ]================================= 
        // ---[ Test Routes ]---
app.get('/ping', (req, res) => {
    return res.send('PONG')
})

app.get('/', (req, res) => {
    res.send("Home-1")
})


        // ---[ API ]---
app.use('/api', router)      // all of our routes will be prefixed with /api


        // ---[ '/columInfo' ]-----------------------------------------------
router.route('/columInfo')

.get((req, res) => {  // Get all Records from DB
    console.log("Send all records to FE.")
    db.select().from('Profiles').columnInfo().then((data) => {
        res.send(data)
    }) 
})


        // ---[ '/singers' ]-----------------------------------------------
router.route('/singers')

.get((req, res) => {  // Get all Records from DB
    console.log("Send all records to FE.")
    db.select().from('Profiles').then((data) => {
        res.send(data)
    }) 
})

.post((req, res) => {  // Add One to the Database
    console.log( 'Data from FE:', req.body.name, " - ", req.body.country, " - ", req.body.email )
    db.insert({ name: req.body.name, country: req.body.country, email: req.body.email }).into('Profiles').then((data) => {
        res.send(data)
    }).catch( (error) => { res.send(error) })
})


        // ---[ '//singers/:email' ]-----------------------------------------------
router.route('/singers/:email')    // delete or Full-Update a singer record using 'email' ( URL: http://localhost:8080/api/singers/:email )

.delete( (req, res) => {  
    console.log("Delet User with email: ", req.params.email)
    db.select().from('Profiles').where('email', req.params.email).del().then((data) => {
        console.log("To Delete: ")
        res.send({ success: "Record deleted." })
    }) 
})

.put( (req, res) => {  
    console.log("Update User with email: ", req.params.email)
    console.log("Info: ", req.body.name, " - ", req.body.country, " - ", req.body.email)
    db.select().from('Profiles').where('email', req.params.email).update({ name: req.body.name, country: req.body.country, email: req.body.email }).then((data) => {
        console.log("Record Updated. ")
        res.send({ success: "Record Updated" })
    }) 
})


        // ---[ '//singers/:email' ]-----------------------------------------------
router.route('/singers/up/:email')    // delete or Full-Update a singer record using 'email' ( URL: http://localhost:8080/api/singers/:email )

.put( (req, res) => {  
    console.log("Up User with email: ", req.params.email)
    console.log("With data2: ", req.body )
    db.select().from('Profiles').where('email', req.params.email).update(req.body).then((data) => {
        console.log("Record Updated. ")
        res.send({ success: "Record Updated" })
    }) 
})










// ===[ FILE-MANIPULATIO ]============================
let myCount = 1
let sourceFolder = './01-FTP/'
// console.log("Count: ", myCount, sourceFolder)


const theFun1 = () => {

    fs.readdir(sourceFolder, (err, files) => {

        if(err){ 
            console.log("Error 1: ", err) 
        }else if(files.length > 0){
            console.log(` ============================== \n Check: ${myCount} - For Files.`)
            console.log(files)
            console.log("Next file to Process: ", files[files.length -1])

                // Reading data on XML File
            fs.readFile( `./01-FTP/${files[files.length -1]}`, function(err, data) {
                let jsonData = parser.toJson(data);  // <-- This load jsonData variable with JSON
                // console.log("to json ->", jsonData)
                let jsOBJ = JSON.parse(jsonData)     // <-- This change from JSON -to-> JavaScript.  
                console.log("\nThe JS Object: ", jsOBJ)


                console.log("\nThe Hotel name and this night stays: ", jsOBJ.OTA_HotelStayInfoNotifRQ.StayInfos.HotelName)
                console.log("\n1st Costumer Name: ", jsOBJ.OTA_HotelStayInfoNotifRQ.StayInfos.StayInfo[3].HotelReservation.ResGuests.ResGuest.Profiles.ProfileInfo.Profile.Customer.PersonName.GivenName)
                console.log("1st Costumer Last Name: ", jsOBJ.OTA_HotelStayInfoNotifRQ.StayInfos.StayInfo[3].HotelReservation.ResGuests.ResGuest.Profiles.ProfileInfo.Profile.Customer.PersonName.Surname)
                

                    // Copy last file on array to 02-Storage Directory
                fs.copyFile(`./01-FTP/${files[files.length -1]}`, `./02-Storage/${files[files.length -1]}`, (err) => {
                    if (err) throw err;
                    console.log('\n File was copied to destination.txt');

                        // Deleting last file on the Array
                    fs.unlink(`./01-FTP/${files[files.length -1]}`, (err) => {
                        if (err) throw err;
                        console.log(' File was deleted \n ==============================');
                    })
                })
            })

               
        }else{
            console.log(`Check: ${myCount} - No File to Process`)
        }
    
      })

    myCount = myCount + 1
}


setInterval(() => { theFun1() }, 2000)



// ===[ Server ]============================
// app.listen((process.env.PORT || 3000), (err) => {
    app.listen((process.env.PORT || 5000), (err) => {
        if(err){ throw err }
    console.log("Server LOP: 5000 .....\n")
})




// const check1 = () => {
//   let sourceFolder = './01-FTP/'

//   fs.readdir(sourceFolder, (err, files) => {
//     if(err){ 
//         console.log("Error: ", err) 
//     }else{
//         console.log(`\n =================== \n Check: ${myCount}. Files in Folder:`)
//         console.log(files)
//         console.log("The name:", files[files.length -1])
//     }

//   })

//   myCount += 1
// }




// ==================================================

// reading data from file
            // axios.get(`./01-FTP/${files[files.length -1]}`)
            // axios.get(XMLData)
            //     .then((response) => { return response.text() })
            //     .then((response) => { parseString(response, (err, result) => { console.log( result ) })  })
            //     .then((response) => { return convert.xml2js(response, {compact: true, spaces: 4}) })
            //     .then((response) => { console.log("***************** \n The Data from File: ", response, "\n*******************") } )
            //     .then(
            //             // Copy last file on array to 02-Storage Directory
            //         fs.copyFile(`./01-FTP/${files[files.length -1]}`, `./02-Storage/${files[files.length -1]}`, (err) => {
            //             if (err) throw err;
            //             console.log('file was copied to destination.txt');

            //                 // Deleting last file on the Array
            //             fs.unlink(`./01-FTP/${files[files.length -1]}`, (err) => {
            //                 if (err) throw err;
            //                 console.log('File was deleted \n ==============================');
            //             })
            //         })
            //     )
            //     .catch((err) => console.log(err) )