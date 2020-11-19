class User{
    constructor(username,password,student = false,age,plec) {
        this.id = users.length + 1
        this.username = username
        this.password = password
        if(student == "on"){
        this.student = true}
        else{
            this.student = student
        }
        this.age = age
        this.plec = plec
    }
}



const express = require("express")
const app = express()
const bodyParser = require("body-parser")

let users =[{id:1,username:"test",password:"123",student:true,age:15,plec:"K"},
{id:2,username:"stifano",password:"123",student:true,age:18,plec:"M"},
{id:3,username:"Bajer",password:"123",student:false,age:5,plec:"M"},
{id:4,username:"user",password:"123",student:true,age:3,plec:"K"}]

// let fromLogout = false
let logged = false
// app.locals.login = false
app.use(express.static(`static`))


app.listen(process.env.PORT||3000,function(req,res){
    console.log("Działa");
})

// app.set("view engine","ejs") potrzebne do renderowania template'ów (najpierw było robione z pomocą ejs)

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/",function(req,res){

    // if(app.locals.login && fromLogout){
    //     app.locals.login = !app.locals.login
    //     fromLogout = false
    // }
    
    // app.locals.url = ""
    res.sendFile("index.html")
})

app.get("/register",function(req,res){
    // app.locals.url = "register"
    // res.render("index")
    res.sendFile(`${__dirname}/static/pages/register.html`)
})

app.post("/register",function(req,res){
   let userExist = false
    for (let ob of users){
        if(ob.username == req.body.username){
            res.send("User istnieje")
            userExist = true
            break
        }
    }
   if(!userExist){
    users.push(new User(req.body.username,req.body.password,req.body.student,req.body.age,req.body.plec))
    console.log(users);
    res.send("Dodano")
   }
})

app.get("/login",function(req,res){

    // app.locals.url = "login"
    // res.render("index")
    res.sendFile(`${__dirname}/static/pages/login.html`)
})

app.post("/admin",function(req,res){
    let dataCorrect = false
    for(let ob of users){
        if(ob.username == req.body.username && ob.password == req.body.password){
            dataCorrect = true
        }
    }

    if(dataCorrect){
    
    // app.locals.url = "admin"
    // app.locals.login = true
    // res.render("index")
    logged = true
    res.sendFile(`${__dirname}/static/pages/admin-logged.html`)

}
else{
    res.send('złe passy <a href="/login">Powrót</a>')
}
})
app.get("/admin",function(req,res){
    if(logged){
    res.sendFile(`${__dirname}/static/pages/admin-logged.html`)
}
else{
    res.sendFile(`${__dirname}/static/pages/admin.html`)
}
})
app.get("/logout",function(req,res){
    // fromLogout = true
    logged =false
    res.redirect("/")
})


//Działa nie zależnie od EJS
app.get("/show",function(req,res){
    if(logged){
    let tableContent=""
    for(let ob of users){
        let tableRow = "<tr>"
        for(let key in ob){
            let tableColumn = '<td style="border:1px solid black;">'
            tableColumn += `${key}:${ob[key]}`
            tableColumn += "</td>"
            tableRow += tableColumn
        }
        
        tableRow += "</tr>"
        tableContent += tableRow
    }
    res.send(`<div> 
    <a href="/show">show</a> 
    <a href="/gender">gender</a>
    <a href="/sort">sort</a> 
    </div>
    <table style="border-collapse: collapse;"> ${tableContent} </table>`)
}
else{
    res.sendFile(`${__dirname}/static/pages/admin.html`)
}
})

app.get("/gender", function(req,res){
    if(logged){
    let tableContentMale=""
    let tableContentFemale=""
    
    for(let ob of users){
        if(ob.plec == "K"){
        let tableRow = "<tr>"
       
            let tableColumn = '<td style="border:1px solid black;">'
            tableColumn += `id: ${ob.id}`
            tableColumn += "</td>"
            tableColumn += '<td style="border:1px solid black;">'
            tableColumn += `Płeć: ${ob.plec}`
            tableColumn += "</td>"
            tableRow += tableColumn

        tableRow += "</tr>"
        tableContentFemale += tableRow
    }else{
        let tableRow = "<tr>"
        
        let tableColumn = '<td style="border:1px solid black;">'
            tableColumn += `id: ${ob.id}`
            tableColumn += "</td>"
            tableColumn += '<td style="border:1px solid black;">'
            tableColumn += `Płeć: ${ob.plec}`
            tableColumn += "</td>"
            tableRow += tableColumn
        
        tableRow += "</tr>"
        tableContentMale += tableRow
    }
    }
    res.send(`<div> 
    <a href="/show">show</a> 
    <a href="/gender">gender</a>
    <a href="/sort">sort</a> 
    </div>
    
    <table style="border-collapse: collapse;"> ${tableContentFemale} </table>
    <table style="border-collapse: collapse; margin-top:40px"> ${tableContentMale} </table>`)
}
else{
    res.sendFile(`${__dirname}/static/pages/admin.html`)
}
})
app.get("/sort",function(req,res){
    //załadowanie strony
    if(logged){
    let tableContent=""
    for(let ob of users){
        let tableRow = "<tr>"
        for(let key in ob){
            let tableColumn = '<td style="border:1px solid black;">'
            tableColumn += `${key}:${ob[key]}`
            tableColumn += "</td>"
            tableRow += tableColumn
        }
        
        tableRow += "</tr>"
        tableContent += tableRow
    }
    res.send(`<div> 
    <a href="/show">show</a> 
    <a href="/gender">gender</a>
    <a href="/sort">sort</a> 
    </div>
    <form onchange="this.submit()"action="/sort" method="POST">
    <label for="maleje">Malejąco</label>
    <input type="radio" name="sortowanie" value="maleje">
    <label for="rosnaco">Rosnąco</label>
    <input type="radio" name="sortowanie" value="rosnie">
   
    </form>
    
    <table style="border-collapse: collapse;"> ${tableContent} </table>`)
}
else{
    res.sendFile(`${__dirname}/static/pages/admin.html`)
}
})

app.post("/sort",function(req,res){
    const placeholder = users
    if(req.body.sortowanie == "maleje"){
        placeholder.sort(function (a, b) {
            return parseFloat(a.age) - parseFloat(b.age);
        });  
    

    let tableContent=""
    for(let ob of placeholder){
        let tableRow = "<tr>"
        for(let key in ob){
            let tableColumn = '<td style="border:1px solid black;">'
            tableColumn += `${key}:${ob[key]}`
            tableColumn += "</td>"
            tableRow += tableColumn
        }
        
        tableRow += "</tr>"
        tableContent += tableRow
    }
    res.send(` <div> 
    <a href="/show">show</a> 
    <a href="/gender">gender</a>
    <a href="/sort">sort</a> 
    </div>
    <form onchange="this.submit()"action="/sort" method="POST">
    <label for="maleje">Malejąco</label>
    <input type="radio" name="sortowanie" value="maleje">
    <label for="rosnaco">Rosnąco</label>
    <input type="radio" name="sortowanie" value="rosnie">
   
    </form>
    <table style="border-collapse: collapse;"> ${tableContent} </table>`)
}else{
    placeholder.sort(function (a, b) {
        return parseFloat(b.age) - parseFloat(a.age);
    });  
    let tableContent=""
    for(let ob of placeholder){
        let tableRow = "<tr>"
        for(let key in ob){
            let tableColumn = '<td style="border:1px solid black;">'
            tableColumn += `${key}:${ob[key]}`
            tableColumn += "</td>"
            tableRow += tableColumn
        }
        
        tableRow += "</tr>"
        tableContent += tableRow
    }
    res.send(`<div> 
    <a href="/show">show</a> 
    <a href="/gender">gender</a>
    <a href="/sort">sort</a> 
    </div>
    
    <form onchange="this.submit()"action="/sort" method="POST">
    <label for="maleje">Malejąco</label>
    <input type="radio" name="sortowanie" value="maleje">
    <label for="rosnaco">Rosnąco</label>
    <input type="radio" name="sortowanie" value="rosnie">
   
    </form>
    
    <table style="border-collapse: collapse;"> ${tableContent} </table>`)
}
})