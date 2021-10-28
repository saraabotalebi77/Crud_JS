let form = document.getElementById("form-information");
let tbody = document.getElementById("tbody");
let btn = document.getElementById("btn");
let title = document.getElementById("title");
let trash = document.getElementById("icon-trash");


let validFirstName = document.getElementById("valid-firstName");
let validLastName = document.getElementById("valid-lastName");
let validEmail = document.getElementById("valid-email");
let validPhoneNumber = document.getElementById("valid-phoneNumber");


let data = [];
let id = null;
let text ;
let icon ;

const emailPattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const phonePattern = /^(\+98|0)?9\d{9}$/;

if(localStorage.getItem("userInformation")){
    data = JSON.parse(localStorage.getItem("userInformation"));
    let index = data.length-1;
    document.getElementById("firstName").value = data[index].firstName;
    document.getElementById("lastName").value = data[index].lastName;
    document.getElementById("email").value = data[index].email;
    document.getElementById("phoneNumber").value = data[index].phoneNumber;
    render();
}

async function checkInformation(text,icon){
    let result = await Swal.fire({
        text: `${text}`,
        icon: `${icon}`,
        customClass:{
                icon : 'style-icon',
            },
        allowEnterKey: false,
        showCancelButton: true,
        confirmButtonText: 'بله',
        cancelButtonText: 'خیر',
        });
        return(result.isConfirmed);
}
trash.addEventListener("click",()=>{
    data = [];
    render();
})

form.onsubmit = function(event){
    event.preventDefault();
    let firstName = document.getElementById("firstName").value;
    let lastName = document.getElementById("lastName").value;
    let email = document.getElementById("email").value;
    let phoneNumber = document.getElementById("phoneNumber").value;
    validFirstName.style.display = "none";
    validLastName.style.display = "none";
    validEmail.style.display = "none";
    validPhoneNumber.style.display = "none";
    if(firstName && lastName && email.match(emailPattern) && phoneNumber.match(phonePattern)){
        let objNewUser = {
            firstName ,
            lastName ,
            email ,
            phoneNumber ,
        };
        if(id == null)
        {
            let checkExist = true ;
            for(let i=0 ; i<data.length ;i++){
                if(data[i].firstName == objNewUser.firstName && data[i].lastName == objNewUser.lastName && data[i].email == objNewUser.email && data[i].phoneNumber == objNewUser.phoneNumber){
                        checkExist = false;
                        break;
                    }
            }
            if(checkExist){
                icon = 'success';
                text = "اطلاعات وارد شده ذخیره شود ؟";
            }
            else{
                icon = 'warning';
                text = "این اطلاعات قبلا دخیره شده است! ذخیره شود ؟";
            }
            checkInformation(text,icon).then((result)=>{
                if(result){
                    data.push(objNewUser);
                    render();
                }
                document.getElementById("firstName").value = "";
                document.getElementById("lastName").value = "";
                document.getElementById("email").value = "";
                document.getElementById("phoneNumber").value = "";
            })
           
        }
        else{    
            checkInformation("اطلاعات ویرایش شود؟","warning").then((result)=>{
                if(result==true){
                    data = data.map((item,index)=> (index!=id)?item:objNewUser);
                    id = null;
                    title.innerHTML = "ایجاد حساب کاربری";
                    btn.innerHTML = "عضویت";
                    render();
                }
                document.getElementById("firstName").value = "";
                document.getElementById("lastName").value = "";
                document.getElementById("email").value = "";
                document.getElementById("phoneNumber").value = "";
            });
        }
     
        
    }
    else{
        if(firstName==""){
            validFirstName.innerHTML = "وارد کردن نام الزامی است !";
            validFirstName.style.display = "block";
        }
        if(lastName==""){
            validLastName.innerHTML = "وارد کردن نام خانوادگی الزامی است !";
            validLastName.style.display = "block";
        }
        if(email==""){
            validEmail.innerHTML = "وارد کردن ایمیل الزامی است !";
            validEmail.style.display = "block";
        }
        else if(!(email.match(emailPattern))){
            validEmail.innerHTML = "ایمیل وارد شده معتبر نیست !";
            validEmail.style.display = "block";
        }
        if(phoneNumber==""){
            validPhoneNumber.innerHTML = "وارد کردن شماره همراه الزامی است !";
            validPhoneNumber.style.display = "block";
        }
        else if(!(phoneNumber.match(phonePattern))){
            validPhoneNumber.innerHTML = "شماره همراه وارد شده معتبر نیست !";
            validPhoneNumber.style.display = "block";
        }
    }
}


function removeUser(index)
{
    validFirstName.style.display = "none";
    validLastName.style.display = "none";
    validEmail.style.display = "none";
    validPhoneNumber.style.display = "none";
    data.splice(index,1);
    render();
}
function editUser(index){
    validFirstName.style.display = "none";
    validLastName.style.display = "none";
    validEmail.style.display = "none";
    validPhoneNumber.style.display = "none";
    title.innerHTML = "ویرایش اطلاعات";
    btn.innerHTML = "اعمال تغییرات";
    document.getElementById("firstName").value = data[index].firstName;
    document.getElementById("lastName").value = data[index].lastName;
    document.getElementById("email").value = data[index].email;
    document.getElementById("phoneNumber").value = data[index].phoneNumber;
    id = index;

}
function render(){
    tbody.innerHTML = "";
    for(let i=0 ; i<data.length ; i++){
        let newUser = `<tr>
            <td><i class="fa fa-remove" style="cursor:pointer;" onclick="removeUser(${i})"></i></td>
            <td><i class="fa fa-edit" style="cursor:pointer;" onclick="editUser(${i})"></i></td>
            <td>${data[i].firstName}</td>
            <td>${data[i].lastName}</td>
            <td>${data[i].email}</td>
            <td>${data[i].phoneNumber}</td>
        </tr>`;
        tbody.insertAdjacentHTML("beforeend",newUser);
    };
    localStorage.setItem("userInformation",JSON.stringify(data));
}
