//hard177

var menutrig=false
var anc_color=null;
var catfile
const cross="../resources/cross.svg"
const burger="../resources/burger.svg"
const new_anc_color="rgb(255, 165, 0)"
var mynav =document.getElementsByTagName("nav")
var menu_button=document.getElementById("menu_button")
var pageref= window.location.href
var page_name
var articles
var MAX_HEIGHT
var hiders

if(pageref.includes("#"))
{
    page_name=pageref.substring(pageref.lastIndexOf("/")+1,pageref.lastIndexOf("#"))
}
else{page_name=pageref.substring(pageref.lastIndexOf("/")+1,pageref.length)}

menu_button.addEventListener("click",open_close)
function change_path(){
    let burger_path = document.getElementsByClassName("burger_path")
    burger_path.stroke = 'orange'
}
menu_button.addEventListener("mouseover", change_path)
menu_button.addEventListener("mouseout", (event)=>{
    let burger_path = document.getElementsByClassName("burger_path")
    burger_path.stroke = 'black'
  })

for(let navig_sel of mynav)
{
navig_sel.addEventListener("mouseover",nav_down)
navig_sel.addEventListener("mouseout",nav_up)
}
anc_color=mynav[0].children[0].style.color;
////////////////////////

//////////////////////////
let content="";
const filename="main.xml"
let request=new XMLHttpRequest()
request.open("GET",filename,true )
request.send()
request.onreadystatechange = function() 
{
 if (request.readyState == 4 && request.status == 200) {
 catfile=request.responseXML

let xmlcode=catfile//parce.parseFromString(catfile,'text/xml')

let rootxml=xmlcode.getElementsByTagName("catalog")[0]
for(let elem=0; elem< rootxml.childElementCount;elem++)
{
    //if(rootxml.childNodes[0].tag)
    content+=("<a href=category.html#" +rootxml.getElementsByTagName("name")[elem].innerHTML + ">"
    +rootxml.getElementsByTagName("realname")[elem].innerHTML + "</a>"
)
}
document.getElementsByTagName("nav")[0].innerHTML=content
if(page_name=="main.html" || page_name=="")
{
    content = ""
for(let elem=0; elem< rootxml.childElementCount;elem++)
{
    //if(rootxml.childNodes[0].tag)
    content+=("<figure><a href=category.html#" +rootxml.getElementsByTagName("name")[elem].innerHTML + ">"
    +"<img alt='photo not found' src='"+rootxml.getElementsByTagName("photo")[elem].innerHTML  +"'/>"
    +"<figcaption>"
    +rootxml.getElementsByTagName("realname")[elem].innerHTML
    +"</figcaption> </a>"
    +"</figure>")
}
document.getElementsByClassName("content")[0].innerHTML=content
}}
}
///parce end

//parce2 start
if(page_name=="category.html")
{
let content="";
const filename=pageref.substring(pageref.lastIndexOf("#")+1,pageref.length)+".xml"
let request=new XMLHttpRequest()
request.open("GET",filename,true )
request.send()
request.onreadystatechange = function() 
{
 if (request.readyState == 4 && request.status == 200) {
 catfile=request.responseXML
let xmlcode=catfile
let rootxml=xmlcode.getElementsByTagName("catalog")[0]
for(let elem=0; elem< rootxml.childElementCount;elem++)
{
    let articul_buffer=rootxml.getElementsByTagName("articul")[elem].innerHTML
    content+=("<article class='goodbar'>"
    +"<img alt='photo not found' src='"+rootxml.getElementsByTagName("photo")[elem].innerHTML  +"'/>"
    +"<p>"+rootxml.getElementsByTagName("productname")[elem].innerHTML+"</p>"
    +"<p>"+"$" +rootxml.getElementsByTagName("price")[elem].innerHTML+"</p>"
    +"<p> артикул: "+rootxml.getElementsByTagName("articul")[elem].innerHTML+"</p>"
    +"<div>"+rootxml.getElementsByTagName("description")[elem].innerHTML+"</div>"
    +"<div class = 'change_button1'><button value="+articul_buffer+" class='addbutton' "+">добавить в корзину </button></div>"
    +"</article>")
}
document.getElementsByClassName("content")[0].innerHTML=content

for(let button of document.getElementsByClassName("addbutton"))
{
    button.addEventListener("click",addtocart)
    button.addEventListener("click", (event)=>{
        let button2 = 'товар в корзине'
        event.target.innerHTML = button2
        event.target.style.color = 'white'
        event.target.style.background = 'green'
        })
}

}}


if(window.localStorage.getItem("cart_items")==null)
{
window.localStorage.setItem("cart_items",[])
}

}
///parce2 end


////cart part
if(page_name=="cart.html")
{
    updater()
    if(document.getElementById("order"))
    document.getElementById("order").addEventListener("click",confirm_order)
}
////cart end

function addtocart(handler)
{
let elem=0
let shiftcounter=0

let buff={}
if((window.localStorage.getItem("cart_items"))){buff = JSON.parse(window.localStorage.getItem("cart_items"))}
let swtrig=false

for(let prop in buff ){ if(buff[prop].articul==handler.target.value){elem=prop;swtrig=true;break;} elem++; }

if(!swtrig){
elem=0
for(let prop =0;prop<Object.keys(buff).length ;prop++ ){if(!buff[prop]){break} if(buff[prop].articul==handler.target.value){break;}  elem++; }
}

let shiftbuff = catfile.getElementsByTagName("articul"); 
for(let prop2 in shiftbuff)
{if(shiftbuff[prop2].innerHTML==handler.target.value){break} shiftcounter++}

let buff_obj=
{   
    productname:catfile.getElementsByTagName("productname")[shiftcounter].innerHTML,
    description:catfile.getElementsByTagName("description")[shiftcounter].innerHTML,
    articul:catfile.getElementsByTagName("articul")[shiftcounter].innerHTML,
    price:catfile.getElementsByTagName("price")[shiftcounter].innerHTML,
    photo:catfile.getElementsByTagName("photo")[shiftcounter].innerHTML,
    count:1
}

buff[elem]=buff_obj
window.localStorage.setItem("cart_items",JSON.stringify(buff))
}

// _____________________________________________________
function confirm_order()
{
    let request= new XMLHttpRequest()
    request.open("POST","//localhost:5500/pages/node_back",true )
    request.setRequestHeader('Content-Type', 'application/json')
    request.setRequestHeader("X-Requested-With", "XMLHttpRequest");

    let sendbuff=JSON.parse(window.localStorage.getItem("cart_items"))
    sendbuff["phone"]=document.getElementById("phone").value

    request.send(JSON.stringify(sendbuff))
    window.localStorage.setItem("cart_items","{ }")
    document.getElementsByClassName("content")[0].innerHTML ="<section><p>ваш заказ отправлен,"
    +"наш менеджер созвонится с вами в ближашее время </p></section>"

}
// _________________________________________________________________________________
function delete_item(elem)
{
    let buffer_delet=JSON.parse(window.localStorage.getItem("cart_items")) 
    delete buffer_delet[elem.target.value]
    window.localStorage.setItem("cart_items",JSON.stringify(buffer_delet))
    updater()
}
function clearcart()
{
    window.localStorage.setItem("cart_items","{}")
    updater()
}

function update_count(handler,pos)
{
    let buffer_mod=JSON.parse(window.localStorage.getItem("cart_items")) 
    buffer_mod[pos].count=handler.target.value
    //price count ends
    window.localStorage.setItem("cart_items",JSON.stringify(buffer_mod))
    let total_price_changed=0
    let order_list=JSON.parse(window.localStorage.getItem("cart_items"))
    for(let price_elem in order_list)
    {
        total_price_changed+=(Number(order_list[price_elem].price*order_list[price_elem].count))
    }
    document.getElementById("price_show").innerHTML=total_price_changed
    }
    function updater()
    {
        let totprice=0
        let content_buff=""
        let order_list=JSON.parse(window.localStorage.getItem("cart_items"))
        let count_holders
        
        if(Object.keys(order_list).length==0)
        {
            content_buff="<section> <p>Ваша корзина пуста, положите товар в корзину </p> </section>"
            document.getElementsByClassName("content")[0].innerHTML=content_buff
            return
        }
        for(let elem in order_list)
        {
            
            content_buff+="<article class='goodbar'>"+ "<img alt='photo not found' src='"
            +order_list[elem].photo+"'/> "+"<div class='texthold'>"+"<p>"+order_list[elem].productname+"</p>"
            +"<p>артикул: "+order_list[elem].articul+"</p>"+"<p>$"+order_list[elem].price+"</p>"
            +"<div>"+order_list[elem].description+"</div>"
            +"</div>"+"<input type='text' class='count' value="+order_list[elem].count+" width=6em/>" 
            +"<button class='idelbutton' value="+elem+"> удалить </button>"
            +"</article>"
            totprice+=Number(order_list[elem].price)*order_list[elem].count
        }
        content_buff+="<section>"
        +"<button id='cartclear'>очистить корзину</button>"
        +"<p> Итоговая цена $<span id='price_show'>"+totprice+"</span></p>"
        +"<form>"
        +"<p> Телефон "+"<input type='text' id='phone' required=''/>"+"</p>" 
        +"<p> Адрес "+"<input type='text'  required ='' />"+"</p>"
        +"<p> Номер карты "+"<input type='text' required =''/>"+"</p>"
        +"<p> Срок действия "+"<input type='text' />"+"</p>"
        +"<p> CVV "+"<input type='text' />"+"</p>"
        +"<button id='order'> оформить заказ </button>"
        +"</form>"
        +"</section>"
        document.getElementsByClassName("content")[0].innerHTML=content_buff
        const button_buff =document.getElementsByClassName("idelbutton")
        
        for(const button_ins of button_buff){button_ins.addEventListener("click",delete_item)}
        count_holders = document.getElementsByClassName("count")
        let index_counter=0
        document.getElementById("cartclear").addEventListener("click",clearcart)
        //for(let prop in buff ){if(buff[prop].articul==handler.target.value){break};elem++}
        for(let elem of count_holders){const buffer=index_counter;elem.addEventListener("change",(handler)=>{update_count(handler,buffer)});index_counter++;}
        
    }

function nav_down(handler)
{
    handler.target.style.background=new_anc_color
}
function nav_up(handler)
{
    handler.target.style.background=anc_color
}
function open_close(handler)
{
    if(menutrig)
    {
        mynav[0].style.display="none"
        handler.target.src=burger
    }
    else
    {
        mynav[0].style.display="flex"
        handler.target.src=cross
    }
    menutrig=!menutrig
}

function show_hide_art(handler){
let show_hide_st = articles[Array.from(hiders).indexOf(handler.target)].style
if(show_hide_st.maxHeight !=MAX_HEIGHT){show_hide_st.maxHeight =MAX_HEIGHT}
else{show_hide_st.maxHeight ="none"}
//даже если объявить сразу как массив
//все равно нужно преобразование
 }
