const _service = new Service();
const _urlTenantProcess = '/api/tenant/tenantprocess';
const _urlTenantAvailableCheck = '/api/tenant/tenantavailablecheck';


const _tenantmodel = [
    { selector: '#txtTenantID', name: "Tenant ID", required: true, model: "TenantID" },
    { selector: '#txtCompanyName', name: "Company Name", required: true, model: "CompanyName" },
    { selector: '#txtEmail', name: "Email", required: true, model: "Email" },
    { selector: '#txtPassword', name: "Password", required: true, model: "Password" },
    { selector: '#txtName', name: "User Name", required: true, model: "UserName" },
    { selector: '#ddlPosition', name: "Position", model: "Position" },
    { selector: '#txtMobileNo', name: "Mobile Number", required: true, model: "MobileNumber" },
];

$(() => {
    config();
    action();
});

const config = () => {

}

const action = () => {
    $('#btnNext').on('click', gotoStep2);
    $('#btnBack').on('click', gobacktoStep1);
    $('#btnRegister').on('click', registerTenant);  
}

const gobacktoStep1 = () => {
    $('#divStep2').hide();
    $('#divStep1').show();
}

const gotoStep2 = () => {

    if (_service.isnullorempty($('#txtTenantID').val())) {
        _service.loadtoast('error', 'Tenant ID is required!');
        return;
    } else if (_service.isnullorempty($('#txtCompanyName').val())) {
        _service.loadtoast('error', 'Company is required!');
        return;
    }

    const _model = {
        TenantID: $('#txtTenantID').val(),
    };

    axios.post(_urlTenantAvailableCheck, _model).then(response => {
       // _service.clearmodel({ fields: _tenantmodel });

        $('#divStep1').hide();
        $('#divStep2').show();
    }).catch(error => {
        _service.loadtoast('error', error.response.data.data.message);
    });
}

const registerTenant = (event) => {
    event.preventDefault();

    const email = $('#txtEmail').val();
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailPattern.test(email)) {
        _service.loadtoast('error', 'Email is invalid!');
        return;
    } 

    const phne = $('#txtMobileNo').val();
    const phonePattern = /^\+?[0-9\s\-().]{7,15}$/;
    if (!phonePattern.test(phne)) {
        _service.loadtoast('error', 'PhoneNumber is invalid!');
        return;
    } 

    const _model = _service.getmodel({ fields: _tenantmodel });

    axios.post(_urlTenantProcess, _model).then(response => {
       
        setTimeout(function () { 
            location.href = "/0/Tenant/HomePage";

        }, 3000);
        _service.loadtoast('success', `Saved Successfully!`);

       
    })
}