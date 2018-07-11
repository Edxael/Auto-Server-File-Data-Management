// ===[ Deps ]========
const express = require('express')
// const path = require('path')
const app = express()
const fs = require('fs')
const parser = require('xml2json')
// const parseString = require('xml2js').parseString;
// const axios = require('axios')


// ===[ Test Routes ]=================================
app.get('/ping', (req, res) => {
    return res.send('PONG')
})

app.get('/', (req, res) => {
    res.send("Home-1")
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
                let jsonData = parser.toJson(data);
                console.log("to json ->", jsonData);

                    // Copy last file on array to 02-Storage Directory
                fs.copyFile(`./01-FTP/${files[files.length -1]}`, `./02-Storage/${files[files.length -1]}`, (err) => {
                    if (err) throw err;
                    console.log('file was copied to destination.txt');

                        // Deleting last file on the Array
                    fs.unlink(`./01-FTP/${files[files.length -1]}`, (err) => {
                        if (err) throw err;
                        console.log('File was deleted \n ==============================');
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