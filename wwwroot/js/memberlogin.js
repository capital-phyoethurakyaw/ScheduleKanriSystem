const _service = new Service();
const _urlLoginCheck = '/api/member/logincheck';
const _urlTenantCheck = '/api/tenant/tenantcheck';
$(() => {
    config();
    action();
});

const config = () => {

    const url = window.location.href;
    const tenantIdFromURL = getFirstSectionAfterDomain(url);
    //$('#pnlCompanyName').html(tenantIdFromURL);


    const _model1 = {
        TenantID: tenantIdFromURL
    };

    axios.post(_urlTenantCheck, _model1).then(response => {
        $('#pnlCompanyName').html(response.data.data[0].CompanyName);
    }).catch(error => {
        setTimeout(function () {
            location.href = "/0/Tenant/HomePage"; 
        }, 2000);
        _service.loadtoast('error', `Tenant Information is incorrect!`);
    });
}

const action = () => {
    $('#btnLogin').on('click', login);
}
function getFirstSectionAfterDomain(url) { 
    const urlObj = new URL(url);
     
    const path = urlObj.pathname;
     
    const firstPart = path.split('/').filter(part => part)[0];

    return firstPart || null;  
}
const login = (event) => {
    event.preventDefault();

    const email = $('#txtEmail').val();
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailPattern.test(email)) {
        _service.loadtoast('error', 'Email is invalid!');
        return;
    }
    const _tenantID = _service.getTanentID();

    const _model = {
        TenantID: _tenantID,
        Email: $('#txtEmail').val(),
        Password: $('#txtPassword').val(),
    }

    axios.post(_urlLoginCheck, _model).then(response => {
        localStorage.setItem(`${_tenantID}_jwtToken`, response.data.token);
        localStorage.setItem(`${_tenantID}_userID`, response.data.data.UserID);
        localStorage.setItem(`${_tenantID}_userName`, response.data.data.UserName);
        localStorage.setItem(`${_tenantID}_ProfilePhoto`, response.data.data.ProfileImage);
        console.log(response.data.data.UserRole);

        localStorage.setItem(`${_tenantID}_UserRole`, response.data.data.UserRole);
         
        location.href = `/${_tenantID}/DutyPlan/DutyPlanTable`;
    }).catch(error => {
        console.log(error);
        _service.loadtoast('error', error.response.data.data.message);
    });
}
